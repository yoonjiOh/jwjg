import React, { useState, useReducer } from 'react';

import { initializeApollo } from '../../apollo/apolloClient';
import { gql, useMutation, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';
import { useRouter } from 'next/router';

import s from './index.module.scss';
import user_s from '../users/users.module.scss';
import util_s from '../../components/Utils.module.scss';
import _ from 'lodash';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const GET_OPINIONS_COMMENTS_DATA = gql`
  query opinions($issuesId: Int!) {
    opinionsWithIssuesId(issuesId: $issuesId) {
      id
      content
      createdAt
      usersId
      issuesId
      stancesId
      user {
        id
        name
        profileImageUrl
      }
      stance {
        id
        orderNum
        title
      }
      opinionReacts {
        like
        usersId
      }
      opinionReactsSum
      opinionCommentsSum
      opinionComments {
        id
        content
        createdAt
        usersId
        user {
          id
          name
          profileImageUrl
        }
        opinionsId
        stancesId
        stance {
          id
          orderNum
          title
        }
        opinionCommentReactsSum
      }
    }
  }
`;

const DO_LIKE_ACTION_TO_OPINION = gql`
  mutation doLikeActionToOpinion(
    $usersId: Int!
    $opinionsId: Int!
    $like: Boolean!
  ) {
    doLikeActionToOpinion(
      usersId: $usersId
      opinionsId: $opinionsId
      like: $like
    ) {
      usersId
      opinionsId
      like
    }
  }
`;

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_OPINIONS_COMMENTS_DATA,
    variables: { issuesId: Number(context.query.issuesId) },
  });

  return {
    props: {
      data: data,
    },
  };
};
 
const Opinions = props => {
  console.log('Opinions 여기 아냐?', props.data.opinionsWithIssuesId);
  const [selectedFilter, setFilter] = useState('opinionReactsSum');
  const [isOpenFilter, setOpenFilter] = useState(false);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);

  const router = useRouter();
  const { usersId } = router.query;

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];
  const sortedData = _.cloneDeep(props.data.opinionsWithIssuesId).sort(
    (a, b) => b[selectedFilter] - a[selectedFilter],
  );

  const filterMap = {
    opinionReactsSum: '좋아요',
    opinionCommentsSum: '댓글 많은',
    createdAt: '최신'
  };

  const handleOpenFilter = () => {
    setOpenFilter(!isOpenFilter);
  };

  const handleChangeFilter = (filter) => {
    setFilter(filter);
    setOpenFilter(false);
  };

  const handleClickLike = async (opinionId, isLikedByMe) => {
    try {
      await doLikeActionToOpinion({
        variables: {
          usersId: Number(usersId),
          opinionsId: Number(opinionId),
          like: isLikedByMe ? false : true,
        },
      }).then((result) => {
        router.reload();
      });
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <Layout title={'코멘트'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        <div className={s.filter} onClick={handleOpenFilter}>
          { isOpenFilter ? '▼' : '▲' } {filterMap[selectedFilter]} 순
        </div>
        {
          sortedData.map((opinion) => {
            const myReact =
            opinion.opinionReacts.filter(react => react.usersId === Number(usersId));
            const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;
            
            return (
            <div className={s.opinionWrapper}>
              <div className={util_s.commentBox} key={opinion.id}>
                <div className={util_s[`stanceMark-${opinion.stance.orderNum}`]} />

                <div className={util_s.commentWrapper}>
                  <div className={user_s.smallProfileWrapper}>
                    <div>
                      <img src={opinion.user.profileImageUrl} />
                    </div>
                    <div className={user_s.profileInfo}>
                      <p className={user_s.name}>{opinion.user.name}</p>
                      <p className={user_s.ago}>{dayjs(opinion.createdAt).fromNow()}</p>
                  </div>
                </div>

                <div className={util_s.commentContentWrapper}>
                  <span style={{ display: 'block' }}>
                    {fruitsForStanceTitle[opinion.stance.orderNum] + ' ' + opinion.stance.title}
                  </span>
                  <span>{opinion.content}</span>
                </div>

                <div className={s.actionsWrapper}>
                  <div className={s.action} onClick={() => handleClickLike(opinion.id, isLikedByMe)}>
                    {
                      isLikedByMe ? <label style={{ display: 'flex', color: '#4494FF', cursor: 'pointer' }}><img
                      src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                      alt="좋아요 버튼"
                    /> 좋아요</label> :
                    <label style={{ display: 'flex', cursor: 'pointer' }}>
                      <img
                        src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                        alt="좋아요 버튼"
                        style={{ marginRight: '5px' }}
                      /> 좋아요</label>
                    }
                    <span style={{ marginLeft: '5px' }}>{opinion.opinionReactsSum}</span>
                  </div>
                  <div className={util_s.likeWrapper}>
                    <img
                      src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
                      alt="코멘트 버튼"
                    />
                    <span style={{ marginLeft: '5px' }}>{opinion.opinionCommentsSum}</span>
                  </div>
                </div>
                
              </div>
            </div>

            <div>
              {opinion.opinionComments && opinion.opinionComments.map(comment => (
                <CommentBox comment={comment} me={{ id: usersId }} />
              ))}
            </div>
          </div>
          );
        })
      }

      {
        isOpenFilter && <div className={s.filterSelector}>
          <div>
            <span className={s.cancelBtn} onClick={handleOpenFilter}>취소</span>
            <span className={s.header}>정렬 기준</span>
          </div>
          {
            _.keys(filterMap).map((key) => {
              return (
              <div className={s.filterRow} onClick={() => handleChangeFilter(key)}>
                <span>{filterMap[key]} 순</span>
                {selectedFilter === key && 
                <img src='https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/check.svg' />}
              </div>)
            })
          }
          
        </div>
      }
      </main>
    </Layout>
  );
};;
export default Opinions;
