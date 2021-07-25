import React from 'react';

import Layout from '../../components/Layout';
import OpinionSummaryBox from '../../components/OpinionSummaryBox';
import Divider from '../../components/Divider';

import s from './users.module.scss';

import { gql } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { GET_USERS } from '../../lib/queries';

dayjs.extend(relativeTime);

const GET_MY_OPINIONS_DATA = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      name
      intro
      profileImageUrl
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

const GET_ISSUES = gql`
  query {
    issues {
      id
      title
      imageUrl
    }
  }
`;

const GET_STANCES = gql`
  query {
    stances {
      id
      orderNum
      title
    }
  }
`;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const meData = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });
  const userId = meData?.data?.userByFirebase?.id;

  const { data } = await apolloClient.query({
    query: GET_MY_OPINIONS_DATA,
    variables: { id: parseInt(userId) },
  });

  const issues = await apolloClient.query({
    query: GET_ISSUES,
  });

  const stances = await apolloClient.query({
    query: GET_STANCES,
  });

  return {
    props: {
      data: data,
      issues_data: issues.data,
      stances_data: stances.data,
    },
  };
});

const MyOpinions = props => {
  const { user } = props.data;
  const headerInfo = {
    headerType: 'editMode',
    subTitle: '작성한 의견',
  };

  return (
    <Layout title={'작성한 의견'} headerInfo={headerInfo} isDimmed={false}>
      <main className={s.main}>
        {user &&
          user.opinions &&
          user.opinions.length &&
          user.opinions.map(opinion => (
            <div>
              <div className={s.smallProfileWrapper}>
                <div>
                  <img src={user.profileImageUrl} />
                </div>
                <div className={s.profileInfo}>
                  <p className={s.name}>{user.name}</p>
                  <p className={s.ago}>{dayjs(opinion.createdAt).fromNow()}</p>
                </div>
              </div>
              <OpinionSummaryBox
                opinion={opinion}
                issues={props.issues_data.issues}
                stances={props.stances_data.stances}
              />
              <Divider />
            </div>
          ))}
      </main>
    </Layout>
  );
};

export default MyOpinions;
