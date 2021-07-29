import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';

import { useRouter } from 'next/router';
import { withAuthUser, AuthAction, useAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';

import common_style from './index.module.scss';
import s from './[id].module.css';
import util_s from '../../components/Utils.module.scss';
import user_s from '../users/users.module.scss';
import { GET_USERS, DO_LIKE_ACTION_TO_OPINION } from '../../lib/queries';

import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { fruits } from '../../utils/getFruitForStanceTitle';
import { getPubDate } from '../../lib/util';

const GET_DATA = gql`
  query opinions($id: Int!) {
    opinions(id: $id) {
      id
      content
      issuesId
      issueStances {
        id
        title
        orderNum
        issuesId
      }
      stancesId
      stance {
        id
        orderNum
        title
      }
      createdAt
      user {
        id
        name
        intro
        profileImageUrl
      }
      opinionComments {
        id
        content
        createdAt
        usersId
        stancesId
        stance {
          id
          orderNum
          title
        }
        user {
          id
          name
          intro
          profileImageUrl
        }
      }
      opinionReacts {
        like
        usersId
      }
      opinionReactsSum
    }
  }
`;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ query }) => {
  const apolloClient = initializeApollo(null);
  const { id } = query;
  const { data } = await apolloClient.query({
    query: GET_DATA,
    variables: { id: Number(id) },
  });

  return {
    props: {
      data: data,
    },
  };
});

const CREATE_OPINION_COMMENT = gql`
  mutation createOpinionComment(
    $content: String!
    $usersId: Int!
    $opinionsId: Int!
    $stancesId: Int!
  ) {
    createOpinionComment(
      content: $content
      usersId: $usersId
      opinionsId: $opinionsId
      stancesId: $stancesId
    ) {
      id
    }
  }
`;

const GET_MY_STANCE = gql`
  query myStance($issuesId: Int, $usersId: Int) {
    myStance(issuesId: $issuesId, usersId: $usersId) {
      usersId
      issuesId
      stancesId
      stances {
        id
        title
        orderNum
      }
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($usersId: Int, $issuesId: Int, $stancesId: Int) {
    createUserStance(usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

const Opinion = props => {
  const [opinionComment, setOpinionComment] = useState('');

  const [createOpinionComment] = useMutation(CREATE_OPINION_COMMENT);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);
  const [createUserStance] = useMutation(CREATE_USER_STANCE);

  const router = useRouter();
  const { id: opinionId } = router.query;
  const issueId = _.head(props.data.opinions).issuesId;
  const opinion = _.head(props.data.opinions);

  const AuthUser = useAuthUser();
  const { data: myData, refetch: refetchUser } = useQuery(GET_USERS, {
    variables: { firebaseUID: AuthUser.id },
  });

  const userId = myData?.userByFirebase?.id;

  const { data: myStanceData } = useQuery(GET_MY_STANCE, {
    variables: {
      issuesId: issueId,
      usersId: userId,
    },
  });

  const myReact =
    opinion && opinion.opinionReacts.filter(react => react.usersId === Number(userId));
  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const handleChangeCommentInput = e => {
    setOpinionComment(e.target.value);
  };

  const handleRegisterOpinionComment = async () => {
    try {
      await createOpinionComment({
        variables: {
          content: opinionComment,
          usersId: Number(userId),
          opinionsId: Number(opinionId),
          stancesId: myStanceData.myStance.stancesId,
        },
      }).then(() => router.reload());
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          usersId: Number(userId),
          opinionsId: Number(opinionId),
          like: isLikedByMe ? false : true,
        },
      }).then(() => router.reload());
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickCommentIcon = () => {
    // @ts-ignore
    document.getElementById('input_comment').select();
  };

  const onStanceClick = async stancesId => {
    await createUserStance({
      variables: {
        usersId: Number(userId),
        issuesId: Number(issueId),
        stancesId,
      },
    })
      .then(() => router.reload())
      .catch(err => console.error(err));
  };

  return (
    <Layout title={'개별 오피니언 페이지'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={common_style.main} style={{ background: '#fff' }}>
        <div className={s.opinionWrapper}>
          <div className={util_s[`stanceMark-${opinion.stance.orderNum}`]} />
          <div className={s.opinionContent} style={{ position: 'relative' }}>
            <div
              className={user_s.smallProfileWrapper}
              style={{ height: '75px', paddingLeft: '0' }}
            >
              <div>
                <img src={opinion.user.profileImageUrl} />
              </div>
              <div className={user_s.profileInfo}>
                <p className={user_s.name}>{opinion.user.name}</p>
                <p className={user_s.ago}>{getPubDate(opinion.createdAt)}</p>
              </div>
            </div>

            <div className={s.stancesWrapper}>
              {fruits[opinion.stance.orderNum]}&nbsp;&nbsp;{opinion.stance.title}
            </div>
            <div>{opinion.content}</div>
            <div
              className={s.likeWrapper}
              style={{ position: 'absolute', bottom: '5px', paddingLeft: '0' }}
            >
              {isLikedByMe ? (
                <div style={{ color: '#4494FF', cursor: 'pointer', display: 'inline-flex' }}>
                  <img
                    src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                    alt="좋아요 버튼"
                    style={{ marginRight: '3px' }}
                  />{' '}
                  {opinion.opinionReactsSum}
                </div>
              ) : (
                <label style={{ cursor: 'pointer' }}>
                  <img
                    src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                    alt="좋아요 버튼"
                    style={{ marginRight: '5px' }}
                  />{' '}
                  {opinion.opinionReactsSum}
                </label>
              )}

              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
                alt="댓글 달기 버튼"
                style={{ marginLeft: '15px', marginRight: '5px' }}
              />
              {opinion.opinionComments.length}
            </div>
          </div>
        </div>

        <div className={s.actionsWrapper}>
          <div className={s.action} onClick={handleClickLike}>
            {isLikedByMe ? (
              <label style={{ color: '#4494FF', cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                  alt="좋아요 버튼"
                />{' '}
              </label>
            ) : (
              <label style={{ cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                  alt="좋아요 버튼"
                  style={{ marginRight: '5px' }}
                />{' '}
              </label>
            )}
          </div>
          <div className={s.action} onClick={handleClickCommentIcon}>
            <img
              src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
              alt="댓글 달기 버튼"
            />
            <span>댓글 달기</span>
          </div>
          <CopyToClipboard text={`https://jwjg.kr/opinions/${opinionId}`}>
            <div className={s.action}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/share.svg"
                alt="공유하기 버튼"
              />
              <span>공유하기</span>
            </div>
          </CopyToClipboard>
        </div>

        <div className={s.commentsWrapper}>
          {opinion.opinionComments &&
            opinion.opinionComments.map(comment => (
              <CommentBox comment={comment} me={{ id: userId }} />
            ))}
        </div>

        {myStanceData && myStanceData.myStance ? (
          <div className={s.commentWrapper}>
            <div className={s.commentInputWrapper}>
              <textarea
                id="input_comment"
                onChange={handleChangeCommentInput}
                value={opinionComment}
                placeholder="댓글을 입력하세요.."
              />
              <button onClick={handleRegisterOpinionComment}>등록</button>
            </div>
          </div>
        ) : (
          <div className={s.stanceSelectorWrapper}>
            <div className={s.guide}>댓글을 남기기 전, 입장을 선택하세요..</div>
            <div className={s.stanceWrapper}>
              {opinion.issueStances.map(stance => (
                <div className={s.stance} key={stance.id} onClick={() => onStanceClick(stance.id)}>
                  {fruits[stance.orderNum]}&nbsp;&nbsp;
                  {stance.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default withAuthUser()(Opinion);
