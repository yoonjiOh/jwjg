import React from 'react';
import s from './index.module.css';
import { initializeApollo } from '../apollo/apolloClient';
import { gql } from '@apollo/client';
import Link from 'next/link';
import _ from 'lodash';
import Layout from '../components/Layout';
import IssueCard from '../components/IssueCard';

const GET_ISSUES_AND_OPINIONS = gql`
  query {
    issues {
      id
      title
      imageUrl
      stances {
        id
        title
      }
      opinions {
        id
        usersId
        content
        user {
          id
          name
        }
        opinionReactsSum
      }
      userStances {
        stancesId
      }
    }
  }
`;

export const getServerSideProps = async _context => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_ISSUES_AND_OPINIONS,
  });
  const issues = data.issues.map(issue => {
    const { opinions } = issue;
    let sortedOpinions;
    if (opinions.length <= 2) {
      sortedOpinions = opinions;
    }
    sortedOpinions = _.chain(opinions)
      .sortBy(o => o.opinionReactsSum)
      .slice(0, 2)
      .value();
    return {
      ...issue,
      opinions: sortedOpinions,
      userStancesSum: issue.userStances?.length,
    };
  });

  return {
    props: {
      data: {
        issues,
      },
    },
  };
};

const Main = props => {
  const { issues } = props.data;
  console.log('issues ', issues);
  const hot_issue = _.maxBy(issues, i => i.opinions.length);
  const other_issues = issues.filter(i => i.id !== hot_issue.id);
  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>🔥 지금 핫한 이슈</h2>
          <article className={s.issueCardWrap}>
            <section className={s.issueCard}>
              {
                <div key={hot_issue.id}>
                  <h3 className={s.issueTitle}>
                    <Link key={hot_issue.title} href={`/issues/${hot_issue.id}`}>
                      {hot_issue.title}
                    </Link>
                  </h3>
                  <div className={s.image}>
                    <img src={hot_issue.imageUrl} />
                  </div>
                  <div>
                    <div className={s.issueCardTop}>
                      <p className={s.responseSum}>🔥 {''}명 참여</p>
                      <p className={s.barchart}></p>
                    </div>
                    <div className={s.line}></div>
                    <div className={s.issueCardCommentWrap}>
                      <p className={s.commentSum}>💬 글 {''}개</p>
                      <div className={s.issueCardComments}>
                        <div className={s.issueCardComment}>
                          <p>{hot_issue.opinions[0]?.usersId}</p>
                          <p>{hot_issue.opinions[0]?.content}</p>
                        </div>
                        <div className={s.issueCardComment}>
                          <p>{hot_issue.opinions[1]?.usersId}</p>
                          <p>{hot_issue.opinions[1]?.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </section>
          </article>
        </div>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>📫 가장 최근 이슈</h2>
          <article className={s.issueCardWrap}>
            {other_issues.map(issue => (
              <IssueCard issue={issue} key={issue.id} />
            ))}
          </article>
        </div>
      </main>
    </Layout>
  );
};

export default Main;
