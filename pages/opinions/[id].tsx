import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import Layout from '../../components/Layout';

import { useAuth } from '../users/lib/users';
import { useRouter } from 'next/router';

import common_style from './index.module.scss';
import s from './[id].module.css';
import _ from 'lodash';

const GET_DATA = gql`
  query opinions($id: Int!) {
    opinions(id: $id) {
      id
      content
      opinionComments {
        id
        content
        createdAt
        usersId
        stancesId
        user {
          id
          name
          intro
          profileImageUrl
        }
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

const Opinion = props => {
  console.log('Opinion props', props);
  const [opinionComment, setOpinionComment] = useState('');
  const [createOpinionComment] = useMutation(CREATE_OPINION_COMMENT);

  const opinion = _.head(props.data.opinions);

  const router = useRouter();
  const { id: opinionId } = router.query;
  console.log('router opinionId', opinionId);

  const handleChangeCommentInput = e => {
    setOpinionComment(e.target.value);
  };

  const handleRegisterOpinionComment = async () => {
    try {
      await createOpinionComment({
        variables: {
          content: opinionComment,
          usersId: 3, // 나중에
          opinionsId: Number(opinionId),
          stancesId: 1, // 나중에
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title={'개별 오피니언 페이지'} headerInfo={{ headerType: 'common' }}>
      <main className={common_style.main}>
        <div className={s.opinionWrapper}>
          {/* <ProfileWidget /> 앞으로 이 컴포넌트를 통해 댓글, 오피니언 등의 작성자를 보여줄 때 재사용한다. */}
          <div className={s.stancesWrapper}>🍇 윤석열 비판적 지지</div>
          <div>{opinion.content}</div>
        </div>
        <div className={s.commentsWrapper}>
          {
            opinion.opinionComments.map((comment) => (
              <div className={s.commentBox}>
                {comment.content}
              </div>
            ))
          }
        </div>
        <div className={s.commentInputWrapper}>
          <textarea
            onChange={handleChangeCommentInput}
            value={opinionComment}
            placeholder="댓글을 입력하세요.."
          />
          <button onClick={handleRegisterOpinionComment}>등록</button>
        </div>
      </main>
    </Layout>
  );
};
export default Opinion;
