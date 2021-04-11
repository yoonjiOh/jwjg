import React from 'react';
import { withApollo } from '../../apollo/client';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import s from './index.module.scss';

const GET_OPINION = gql`
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
        title
      }
      opinionComments {
        id
        content
        createdAt
        opinionCommentReacts {
          like
          users {
            id
            name
            profileImageUrl
          }
        }
      }
      opinionReacts {
        like
        users {
          id
          name
          profileImageUrl
        }
      }
    }
  }
`;

const Opinions = () => {
  const router = useRouter();
  const issue_id = Number(router.query.issue_id);
  const { loading, error, data } = useQuery(GET_OPINION, {
    variables: { issuesId: issue_id },
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  const opinions = data.opinionsWithIssuesId;
  return (
    <Layout title={'코멘트'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        {opinions.map(opinion => (
          <div key={opinion.id}>
            <div>{opinion.id}</div>
            <div>{opinion.content}</div>
            <div>{opinion.createdAt}</div>
            <div>{opinion.issuesId}</div>
            <div>{opinion.stance.title}</div>
            <div>{opinion.user.id}</div>
            <div>{opinion.user.name}</div>
            <img src={opinion.user.profileImageUrl} />
          </div>
        ))}
      </main>
    </Layout>
  );
};
export default withApollo(Opinions);
