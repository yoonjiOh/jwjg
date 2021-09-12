import React from 'react';

import Layout from '../../components/Layout';
import HashTag from '../../components/HashTag';

import s from './users.module.scss';

import { gql } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';
import { GET_USERS, GET_ISSUES } from '../../lib/graph_queries';
import { User } from 'next-auth';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';

const GET_MYPAGE_DATA = gql`
  query user($id: String!) {
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
      opinionComments {
        id
        content
        createdAt
        opinionsId
        stancesId
      }
      userStances {
        issuesId
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
//     query: GET_MYPAGE_DATA,
//     variables: { id: parseInt(userId) },
//   });

//   const issues = await apolloClient.query({
//     query: GET_ISSUES,
//   });

//   return {
//     props: {
//       data: data,
//       issues_data: issues.data,
//     },
//   };
// });

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_MYPAGE_DATA,
      variables: { id: context.user.id },
    });

    const issues = await apolloClient.query({
      query: GET_ISSUES,
    });
    return {
      props: {
        user: context.user,
        data: data,
        issues_data: issues.data,
      },
    };
  },
);

interface Props {
  user: User;
  data: any;
  issues_data: any;
}

const MyHashTags = (props: Props) => {
  const headerInfo = {
    headerType: 'editMode',
    subTitle: '해시태그',
  };

  const relatedIssueIds = _.uniq(
    props.data.user.opinions.map(opinion => opinion.issuesId),
    props.data.user.userStances.map(stance => stance.issuesId),
  );

  const tagsMap = {};

  relatedIssueIds.map(issueId => {
    const matchIssue = _.find(props.issues_data.issues, issue => issue.id === issueId);

    if (matchIssue.issueHashTags.length) {
      matchIssue.issueHashTags.forEach(issueHashTag => {
        const targetTag = issueHashTag.hashTags[0].name;

        if (tagsMap[targetTag]) {
          tagsMap[targetTag]++;
        } else {
          tagsMap[targetTag] = 1;
        }
      });
    }
  });

  return (
    <Layout title={'해시태그'} headerInfo={headerInfo} isDimmed={false}>
      <main className={s.main} style={{ height: '100vh' }}>
        {!_.isEmpty(tagsMap) && (
          <div className={s.tags} style={{ padding: '10px' }}>
            {_.map(tagsMap, (value, key) => {
              return <HashTag tag={key} count={value} />;
            })}
          </div>
        )}
      </main>
    </Layout>
  );
};

export default MyHashTags;
