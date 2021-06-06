import React, { useState } from 'react';

import { initializeApollo } from '../../apollo/apolloClient';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';

import { useRouter } from 'next/router';
import s from './index.module.scss';
import user_s from '../users/users.module.scss';
import util_s from '../../components/Utils.module.scss';

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
  const [idOpenFilter, setOpenFilter] = useState(false);

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  const sortedData = props.data.opinionsWithIssuesId.sort((a, b) => b[selectedFilter] - a[selectedFilter]);

  const filterMap = {
    opinionReactsSum: '좋아요',
    opinionCommentsSum: '댓글 많은',
    createdAt: '최신'
  };

  const handleOpenFilter = () => {
    setOpenFilter(true)
  }
  return (
    <Layout title={'코멘트'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        <div className={s.filter} onClick={handleOpenFilter}>
          ▼ {filterMap[selectedFilter]} 순
        </div>
        {
          sortedData.map((opinion) => (
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
                  <div className={util_s.likeWrapper}>
                    <img
                      src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                      alt="좋아요 버튼"
                    />
                    <span style={{ marginLeft: '5px' }}>{opinion.opinionReactsSum}</span>
                  </div>
                  <div className={util_s.likeWrapper}>
                    <img
                      src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
                      alt="좋아요 버튼"
                    />
                    <span style={{ marginLeft: '5px' }}>{opinion.opinionCommentsSum}</span>
                  </div>
                </div>
                
              </div>
            </div>

            <div>
              {opinion.opinionComments && opinion.opinionComments.map(comment => (
                <CommentBox comment={comment} me={null} />
              ))}
            </div>
          </div>
          ))
        }

        {
          idOpenFilter && <div className={s.filterSelector}>
            <div>
              <span>취소</span>
              <span>정렬 기준</span>
            </div>
            
            
          </div>
        }
      </main>
    </Layout>
  );
};;
export default Opinions;
