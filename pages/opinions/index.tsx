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

import { DO_LIKE_ACTION_TO_OPINION } from '../../lib/graph_queries';
import { fruits } from '../../utils/getFruitForStanceTitle';
import { getPubDate } from '../../lib/util';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { User } from 'next-auth';

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

const GET_USER = gql`
  query userByFirebase($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      firebaseUID
      name
      intro
      profileImageUrl
      userStance {
        issuesId
        usersId
        stancesId
      }
    }
  }
`;

// export const getServerSideProps = async context => {
//   const apolloClient = initializeApollo(null);
//   const { data } = await apolloClient.query({
//     query: GET_OPINIONS_COMMENTS_DATA,
//     variables: { issuesId: Number(context.query.issueId) },
//   });

//   return {
//     props: {
//       data: data,
//     },
//   };
// };

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo(null);
    const { data } = await apolloClient.query({
      query: GET_OPINIONS_COMMENTS_DATA,
      variables: { issuesId: Number(context.query.issueId) },
    });
    return {
      props: {
        user: context.user,
        data,
      },
    };
  },
);

interface Props {
  user: User;
  data: any;
}

const Opinions = (props: Props) => {
  const [selectedFilter, setFilter] = useState('opinionReactsSum');
  const [isOpenFilter, setOpenFilter] = useState(false);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);
  const router = useRouter();

  const sortedData =
    selectedFilter === 'createdAt'
      ? _.cloneDeep(props.data.opinionsWithIssuesId).sort(
          // @ts-ignore
          (a, b) => new Date(b[selectedFilter]) - new Date(a[selectedFilter]),
        )
      : _.cloneDeep(props.data.opinionsWithIssuesId).sort(
          (a, b) => b[selectedFilter] - a[selectedFilter],
        );

  const filterMap = {
    opinionReactsSum: '좋아요',
    opinionCommentsSum: '댓글 많은',
    createdAt: '최신',
  };

  const handleOpenFilter = () => {
    setOpenFilter(!isOpenFilter);
  };

  const handleChangeFilter = filter => {
    setFilter(filter);
    setOpenFilter(false);
  };

  const handleClickLike = async (opinionId, isLikedByMe) => {
    try {
      await doLikeActionToOpinion({
        variables: {
          userId: props.user.id,
          opinionsId: opinionId,
          like: isLikedByMe ? false : true,
        },
      }).then(() => {
        router.reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title={'코멘트'} headerInfo={{ headerType: 'common' }} isDimmed={isOpenFilter}>
      <main className={s.main}>
        <div className={s.filter} onClick={handleOpenFilter}>
          {isOpenFilter ? '▼' : '▲'} {filterMap[selectedFilter]} 순
        </div>
        {sortedData.map(opinion => {
          const myReact = opinion.opinionReacts.filter(react => react.userId === props.user.id);
          const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;
          const isContentOver = opinion?.content?.length > 128;
          const cutContent = isContentOver
            ? opinion?.content?.slice(0, 128) + '···'
            : opinion.content;

          return (
            <div className={s.opinionWrapper} key={opinion.id}>
              <div className={util_s.commentBox}>
                <div className={util_s[`stanceMark-${opinion.stance.orderNum}`]} />

                <div className={util_s.commentWrapper}>
                  <div className={user_s.smallProfileWrapper}>
                    <div>
                      <img src={opinion.user.image} />
                    </div>
                    <div className={user_s.profileInfo}>
                      <p className={user_s.name}>{opinion.user.name}</p>
                      <p className={user_s.ago}>{getPubDate(opinion.createdAt)}</p>
                    </div>
                  </div>

                  <div className={util_s.commentContentWrapper}>
                    <span style={{ display: 'block' }}>
                      {fruits[opinion.stance.orderNum] + ' ' + opinion.stance.title}
                    </span>
                    <p className={s.commentContent}>
                      {cutContent}{' '}
                      {isContentOver && (
                        <span
                          onClick={() =>
                            router.push({
                              pathname: `/opinions/${opinion.id}`,
                            })
                          }
                          className={s.commentSeeMore}
                        >
                          더보기
                        </span>
                      )}
                    </p>
                  </div>

                  <div className={s.actionsWrapper}>
                    <div
                      className={s.action}
                      onClick={() => handleClickLike(opinion.id, isLikedByMe)}
                    >
                      {isLikedByMe ? (
                        <label
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '18px 0 18px 0',
                            color: '#4494FF',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                            alt="좋아요 버튼"
                          />{' '}
                          <span style={{ marginLeft: '5px', color: '#4494FF' }}>
                            {opinion.opinionReactsSum}
                          </span>
                        </label>
                      ) : (
                        <label
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '18px 0 18px 0',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                            alt="좋아요 버튼"
                            style={{ marginRight: '5px' }}
                          />{' '}
                          <span style={{ marginLeft: '5px' }}>{opinion.opinionReactsSum}</span>
                        </label>
                      )}
                    </div>
                    <div
                      className={util_s.likeWrapper}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
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
                {opinion.opinionComments &&
                  opinion.opinionComments.map(comment => (
                    <CommentBox comment={comment} me={{ id: props.user.id }} key={comment.id} />
                  ))}
              </div>
            </div>
          );
        })}

        {isOpenFilter && (
          <div className={s.filterSelector}>
            <div className={s.filterSelectorRow}>
              <span className={s.cancelBtn} onClick={handleOpenFilter}>
                취소
              </span>
              <span className={s.header}>정렬 기준</span>
            </div>
            {_.keys(filterMap).map(key => {
              return (
                <div key={key} className={s.filterRow} onClick={() => handleChangeFilter(key)}>
                  <span>{filterMap[key]} 순</span>
                  {selectedFilter === key && (
                    <img src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/check.svg" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </Layout>
  );
};
export default Opinions;
