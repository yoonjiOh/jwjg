import React from 'react';
import { withApollo } from '../../apollo/client';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
import common_style from '../index.module.css';
import style from './issue_list.module.css';

const GET_ISSUES = gql`
  query FetchIssues {
    issues {
      id
      title
    }
  }
`;

const IssueList = () => {
  const { loading, error, data } = useQuery(GET_ISSUES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <Layout title={'MAIN'}>
      <main className={common_style.main}>
        <button className={style.btn_add_issue}>
          <Link href={`/new_issue`}>새 이슈 만들기</Link>
        </button>

        <div className={style.wrapper}>
          {data.issues.map(issue => (
            <p className={style.issue_title}>
              <Link key={issue.title} href={`/issue_detail?id=${issue.id}`}>
                {issue.title}
              </Link>
            </p>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default withApollo(IssueList);
