import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import common_style from '../../index.module.css';
import style from './index.module.css';

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
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }}>
      <main className={common_style.main}>
        <div className={style.wrapper}>
          <button className={style.btn_add_issue}>
            <Link href={`/admin/issues/new`}>새 이슈 만들기</Link>
          </button>
          
          {data.issues.map(issue => (
            <p className={style.issue_title}>
              <Link key={issue.title} href={`/admin/issues/${issue.id}`}>
                {issue.title}
              </Link>
            </p>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default IssueList;
