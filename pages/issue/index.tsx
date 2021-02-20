import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";
import React from "react";
import { withApollo } from "../../apollo/client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const new_issue_btn_style = {
    border: '1px solid',
    padding: '10px',
    borderRadius: '7%',
    marginBottom: '50px',
};

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

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className={styles.container}>
      <Header />
            <main className={styles.main}>
                <div style={new_issue_btn_style}><Link href={`/new_issue`}>새 이슈 만들기</Link></div>

                {data.issues.map(issue => (
                    <Link key={issue.title} href={`/issue_detail?id=${issue.id}`}>{issue.title}</Link>
                ))}
            </main>
      <footer className={styles.footer}>Powered by 좌우지간</footer>
    </div>
  );
};

export default withApollo(IssueList);
