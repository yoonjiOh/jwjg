import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';

import { useRouter } from 'next/router';

import common_style from './index.module.scss';
import s from './[id].module.css';
import util_s from '../../components/Utils.module.scss'
import user_s from '../users/users.module.scss'

import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const GET_DATA = gql`
  query opinions($id: Int!) {
    opinions(id: $id) {
      id
      content
      stancesId
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

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { id } = context.query;
  const { data } = await apolloClient.query({
    query: GET_DATA,
    variables: { id: parseInt(id) },
  });

  return {
    props: {
      data: data,
    },
  };
};

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

const Opinion = props => {
  const [opinionComment, setOpinionComment] = useState('');
  const [createOpinionComment] = useMutation(CREATE_OPINION_COMMENT);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);
  
  const router = useRouter();
  const { id: opinionId, userId } = router.query;
  
  const opinion = _.head(props.data.opinions);

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
          usersId: userId,
          opinionsId: Number(opinionId),
          stancesId: 1,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          usersId: Number(userId),
          opinionsId: Number(opinionId),
          like: isLikedByMe ? false : true,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleClickCommentIcon = () => {
    // @ts-ignore
    document.getElementById('input_comment').select();
  }

  console.log('props', props)

  return (
    <Layout title={'개별 오피니언 페이지'} headerInfo={{ headerType: 'common' }}>
      <main className={common_style.main}>
        <div className={s.opinionWrapper}>
          <div className={util_s[`stanceMark-${opinion.stancesId}`]} />
          <div className={s.opinionContent} style={{ position: 'relative' }}>
            <div
              className={user_s.smallProfileWrapper}
              style={{ height: '75px', paddingLeft: '0' }}
            >
              <div>
                <img src={opinion.user.profileImageUrl} />
              </div>
              <div className={user_s.profileInfo} style={{ width: '100%' }}>
                <p className={user_s.name}>{opinion.user.name}</p>
                <p className={user_s.ago}>{dayjs(opinion.createdAt).fromNow()}</p>
              </div>
            </div>

            <div className={s.stancesWrapper}>🍇 윤석열 비판적 지지</div>
            <div>{opinion.content}</div>
            <div
              className={s.likeWrapper}
              style={{ position: 'absolute', bottom: '5px', paddingLeft: '0' }}
            >
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
                style={{ marginRight: '5px' }}
              />
              {opinion.opinionReactsSum}

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
              <label style={{ display: 'flex', color: '#4494FF', cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                  alt="좋아요 버튼"
                />{' '}
                좋아요
              </label>
            ) : (
              <label style={{ display: 'flex', cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                  alt="좋아요 버튼"
                  style={{ marginRight: '5px' }}
                />{' '}
                좋아요
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
          <CopyToClipboard text={`www.jwjg.co.kr/opinions/${opinionId}`}>
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
      </main>
    </Layout>
  );
};
export default Opinion;
