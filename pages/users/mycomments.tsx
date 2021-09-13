import React from 'react';

import Layout from '../../components/Layout';

import s from './users.module.scss';
import util_s from '../../components/Utils.module.scss';

import { gql } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';

import { GET_USERS } from '../../lib/graph_queries';
import { fruits } from '../../utils/getFruitForStanceTitle';
import { getPubDate } from '../../lib/util';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { User } from 'next-auth';

const GET_MY_COMMENTS_DATA = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      name
      intro
      image
      opinionComments {
        id
        content
        createdAt
        usersId
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

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
//   authPageURL: '/users',
// })(async ({ AuthUser }) => {
//   const apolloClient = initializeApollo(null);
//   const meData = await apolloClient.query({
//     query: GET_USERS,
//     variables: { firebaseUID: AuthUser.id },
//   });
//   const userId = meData?.data?.userByFirebase?.id;
//   const { data } = await apolloClient.query({
//     query: GET_MY_COMMENTS_DATA,
//     variables: { id: parseInt(userId) },
//   });

//   return {
//     props: {
//       data: data,
//     },
//   };
// });

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_MY_COMMENTS_DATA,
      variables: { id: context.user.id },
    });
    return {
      props: {
        user: context.user,
        data: data,
      },
    };
  },
);

interface Props {
  user: User;
  data: any;
}

const MyComments = (props: Props) => {
  const { user } = props.data;
  const headerInfo = {
    headerType: 'editMode',
    subTitle: '작성한 댓글',
  };

  return (
    <Layout title={'작성한 댓글'} headerInfo={headerInfo} isDimmed={false}>
      <main className={s.main}>
        {user &&
          user.opinionComments &&
          user.opinionComments.length &&
          user.opinionComments.map(comment => (
            <div className={util_s.commentBox} key={comment.id}>
              <div className={util_s[`stanceMark-${comment.stance.orderNum}`]} />

              <div className={util_s.commentWrapper}>
                <div className={s.smallProfileWrapper}>
                  <div>
                    <img src={user.image} />
                  </div>
                  <div className={s.profileInfo}>
                    <p className={s.name}>{user.name}</p>
                    <p className={s.ago}>{getPubDate(comment.createdAt)}</p>
                  </div>
                </div>

                <div className={util_s.commentContentWrapper}>
                  <span style={{ display: 'block' }}>
                    {fruits[comment.stance.orderNum] + ' ' + comment.stance.title}
                  </span>
                  <span>{comment.content}</span>
                </div>
                <div className={util_s.likeWrapper}>
                  <img
                    src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                    alt="좋아요 버튼"
                  />
                  <span style={{ marginLeft: '5px' }}>{comment.opinionCommentReactsSum}</span>
                </div>
              </div>
            </div>
          ))}
      </main>
    </Layout>
  );
};

export default MyComments;
