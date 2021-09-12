import React from 'react';

import Layout from '../../components/Layout';
import OpinionSummaryBox from '../../components/OpinionSummaryBox';
import Divider from '../../components/Divider';
import { useRouter } from 'next/router';

import s from './users.module.scss';

import { gql } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';
import { GET_USERS, GET_STANCES, GET_ISSUES } from '../../lib/graph_queries';
import { getPubDate } from '../../lib/util';
import { User } from 'next-auth';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { GET_OPINIONS } from '../../lib/graph_queries';

const GET_MY_OPINIONS_DATA = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      name
      intro
      image
      opinions {
        id
        content
        createdAt
        issuesId
        stancesId
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
//     query: GET_MY_OPINIONS_DATA,
//     variables: { id: parseInt(userId) },
//   });

//   const issues = await apolloClient.query({
//     query: GET_ISSUES,
//   });

//   const stances = await apolloClient.query({
//     query: GET_STANCES,
//   });

//   return {
//     props: {
//       data: data,
//       issues_data: issues.data,
//       stances_data: stances.data,
//     },
//   };
// });

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_MY_OPINIONS_DATA,
      variables: { id: context.user.id },
    });

    const issues = await apolloClient.query({
      query: GET_ISSUES,
    });

    const stances = await apolloClient.query({
      query: GET_STANCES,
    });
    const opinions = await apolloClient.query({
      query: GET_OPINIONS,
      variables: { id: Number(context.query.id) },
    });
    return {
      props: {
        user: context.user,
        data: data,
        issues_data: issues.data,
        stances_data: stances.data,
        opinions_data: opinions.data,
      },
    };
  },
);

interface Props {
  user: User;
  data: any;
  issues_data: any;
  stances_data: any;
  opinions_data: any;
}

const MyOpinions = (props: Props) => {
  const user = props.user;
  const headerInfo = {
    headerType: 'editMode',
    subTitle: '작성한 의견',
  };
  const opinions = props.opinions_data;

  const router = useRouter();

  return (
    <Layout title={'작성한 의견'} headerInfo={headerInfo} isDimmed={false}>
      <main className={s.main}>
        {opinions &&
          opinions.length &&
          opinions.map(opinion => (
            <div
              key={opinion.id}
              onClick={() => {
                router.push({
                  pathname: '/opinions/[id]',
                  query: { id: opinion.id },
                });
              }}
            >
              <div className={s.smallProfileWrapper}>
                <div>
                  <img src={user.image} />
                </div>
                <div className={s.profileInfo}>
                  <p className={s.name}>{user.name}</p>
                  <p className={s.ago}>{getPubDate(opinion.createdAt)}</p>
                </div>
              </div>
              <OpinionSummaryBox
                opinion={opinion}
                issues={props.issues_data.issues}
                stances={props.stances_data.stances}
                key={opinion.id}
              />
              <Divider />
            </div>
          ))}
      </main>
    </Layout>
  );
};

export default MyOpinions;
