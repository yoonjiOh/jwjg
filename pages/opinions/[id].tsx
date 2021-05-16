import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';

import { useAuth } from '../users/lib/users';
import { useRouter } from 'next/router';

import common_style from './index.module.scss';
import s from './[id].module.css';
import util_s from '../../components/Utils.module.scss'
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';


const GET_DATA = gql`
  query opinions($id: Int!) {
    opinions(id: $id) {
      id
      content
      stancesId
      opinionComments {
        id
        content
        createdAt
        usersId
        stancesId
        stance {
          id
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
    }
  }
`;

// opinion, OpinionComments, like 다 한번에 가져와야 함
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
  console.log('Opinion props', props);
  const [opinionComment, setOpinionComment] = useState('');
  const [createOpinionComment] = useMutation(CREATE_OPINION_COMMENT);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);

  const opinion = _.head(props.data.opinions);
  const myReact = opinion.opinionReacts.filter(react => react.usersId === 7);
  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const router = useRouter();

  const { id: opinionId } = router.query;

  const handleChangeCommentInput = e => {
    setOpinionComment(e.target.value);
  };

  const handleRegisterOpinionComment = async () => {
    try {
      await createOpinionComment({
        variables: {
          content: opinionComment,
          usersId: 7, // 나중에
          opinionsId: Number(opinionId),
          stancesId: 1, // 나중에
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
          usersId: 7, //나중에
          opinionsId: Number(opinionId),
          like: isLikedByMe ? false : true
        }
      })
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Layout title={'개별 오피니언 페이지'} headerInfo={{ headerType: 'common' }}>
      <main className={common_style.main}>
        <div className={s.opinionWrapper}>
          <div className={util_s[`stanceMark-${opinion.stancesId}`]} />

          {/* <ProfileWidget /> 앞으로 이 컴포넌트를 통해 댓글, 오피니언 등의 작성자를 보여줄 때 재사용한다. */}
          <div className={s.opinionContent}>
            <div className={s.stancesWrapper}>🍇 윤석열 비판적 지지</div>
            <div>{opinion.content}</div>
            <div className={s.likeWrapper}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
              />
            </div>
          </div>
        </div>

        <div className={s.actionsWrapper}>
          <div className={s.action} onClick={handleClickLike}>
            {isLikedByMe ? '벌써 눌렀음'
                : <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
              />
              }
          </div>
          <div className={s.action}>
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
        
        <div className={s.commentWrapper}>
          <div className={s.commentsWrapper}>
            {opinion.opinionComments.map(comment => (
              <CommentBox comment={comment} />
            ))}
          </div>
          <div className={s.commentInputWrapper}>
            <textarea
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
