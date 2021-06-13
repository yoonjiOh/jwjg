import React from 'react';
import s from './index.module.scss';
import { initializeApollo } from '../apollo/apolloClient';
import { gql } from '@apollo/client';
import Link from 'next/link';
import _ from 'lodash';
import Layout from '../components/Layout';
import IssueCard from '../components/IssueCard';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';

const GET_ISSUES_AND_OPINIONS = gql`
  query {
    issues {
      id
      title
      imageUrl
      stances {
        id
        title
        fruit
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

const GET_USERS = gql`
  query {
    users {
      id
      firebaseUID
      name
      intro
      profileImageUrl
    }
  }
`;

export const getServerSideProps = async _context => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_ISSUES_AND_OPINIONS,
  });

  const users = await apolloClient.query({
    query: GET_USERS,
  });

  const issues = data.issues.map(issue => {
    const { opinions, stances, userStances } = issue;
    let sortedOpinions;
    if (opinions.length <= 2) {
      sortedOpinions = opinions;
    }
    sortedOpinions = _.chain(opinions)
      .sortBy(o => o.opinionReactsSum)
      .slice(0, 2)
      .value();
    const newStances = stances.reduce((acc, stance) => {
      const { id, title, fruit } = stance;
      const result = { title: '', sum: 0, fruit };
      for (const userStance of userStances) {
        if (id === userStance.stancesId) {
          result.title = fruit + ' ' + title;
          result.sum += 1;
        }
      }
      if (result.sum !== 0) {
        acc.push(result);
      }
      return acc;
    }, []);
    return {
      ...issue,
      opinions: sortedOpinions,
      opinionsSum: opinions?.length || 0,
      userStancesSum: userStances?.length || 0,
      newStances,
    };
  });

  return {
    props: {
      data: {
        issues,
      },
      users: users.data.users,
    },
  };
};

const Main = props => {
  const { issues } = props.data;
  const hot_issue = _.maxBy(issues, i => i.opinions.length);
  const other_issues = issues.filter(i => i.id !== hot_issue.id);

  const AuthUser = useAuthUser();
  const me = _.head(props.users.filter(user => user.firebaseUID === AuthUser.id));

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
                    <Link
                      key={hot_issue.title}
                      href={`/issues/${hot_issue.id}?userId=${me && me.id}`}
                    >
                      {hot_issue.title}
                    </Link>
                  </h3>
                  <div className={s.image}>
                    <img src={hot_issue.imageUrl} />
                  </div>
                  <div>
                    <div className={s.issueCardTop}>
                      <p className={s.responseSum}>🔥 {hot_issue.userStancesSum}명 참여</p>
                      <p className={s.barchart}>
                        {_.map(hot_issue.newStances, (userStance, idx) => {
                          const ratio = (userStance.sum / hot_issue.userStancesSum) * 100 + '%';
                          return (
                            <div
                              key={userStance.title}
                              className={`${s.stanceItemBarChart} ${s[userStance.fruit]}`}
                              style={{
                                display: 'inline-block',
                                width: ratio,
                              }}
                            >
                              <span>{ratio}</span>
                            </div>
                          );
                        })}
                      </p>
                    </div>
                    <div className={s.line}></div>
                    <div className={s.issueCardCommentWrap}>
                      <p className={s.commentSum}>💬 글 {hot_issue.opinionsSum}개</p>
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
          <article>
            {other_issues.map(issue => (
              <IssueCard issue={issue} key={issue.id} userId={me && me.id} />
            ))}
          </article>
        </div>
      </main>
    </Layout>
  );
};

export default withAuthUser()(Main);
