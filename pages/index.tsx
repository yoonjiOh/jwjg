import React from 'react';
import s from './index.module.scss';
import { initializeApollo } from '../apollo/apolloClient';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

import Link from 'next/link';
import _ from 'lodash';
import Layout from '../components/Layout';
import IssueCard from '../components/IssueCard';
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import CurrentStances from '../components/issue/CurrentStances';
import { GET_USERS } from '../lib/queries';

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
        stancesId
        stance {
          title
        }
        user {
          id
          name
        }
        opinionReactsSum
      }
      userStances {
        stancesId
        issuesId
      }
    }
  }
`;

export const getServerSideProps = withAuthUserTokenSSR({})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const issuesData = await apolloClient.query({
    query: GET_ISSUES_AND_OPINIONS,
  });
  const issues = issuesData.data.issues.map(issue => {
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

  const meData = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });

  return {
    props: {
      data: {
        issues,
        me: meData.data.userByFirebase || null,
      },
    },
  };
});

function HotIssueCard(props) {
  if (!props.issue) {
    return null;
  }
  const hotIssue = props.issue;

  return (
    <div key={hotIssue.id}>
      <h3 className={s.issueTitle}>
        <Link key={hotIssue.title} href={`/issues/${hotIssue.id}`}>
          {hotIssue.title}
        </Link>
      </h3>
      <div className={s.image}>
        <Link key={hotIssue.title} href={`/issues/${hotIssue.id}`}>
          <img src={hotIssue.imageUrl} />
        </Link>
      </div>
      <div>
        <div
          onClick={() =>
            router.push({
              pathname: `/issues/${hotIssue.id}`,
            })
          }
          className={s.issueCardTop}
        >
          <div className={s.responseSum}>🔥 참여 {hotIssue.userStancesSum}</div>
          <CurrentStances
            userStances={hotIssue.userStances}
            stances={hotIssue.newStances}
            withStats={false} // @ts-ignore
            onStanceClick={null}
          />
          <div className={s.barchart}>
            {_.map(hotIssue.newStances, userStance => {
              const ratio = (userStance.sum / hotIssue.userStancesSum) * 100;

              return (
                <div
                  key={userStance.title}
                  className={`${s.stanceItemBarChart} ${s[userStance.fruit]}`}
                  style={{
                    display: 'inline-block',
                    width: ratio + '%',
                  }}
                >
                  <span>{ratio.toFixed(0)} %</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={s.line}></div>
        <div className={s.issueCardCommentWrap}>
          <p className={s.commentSum}>💬 의견 {hotIssue.opinionsSum}</p>
          <div className={s.issueCardComments}>
            <div
              onClick={() => {
                const path = `/opinions/${hotIssue.opinions[0]?.id}`;
                if (!me) {
                  router.push(`/users`);
                  return;
                }
                router.push({
                  pathname: path,
                });
              }}
              className={s.issueCardComment}
            >
              <p>{hotIssue.opinions[0]?.stance?.title}</p>
              <p>{hotIssue.opinions[0]?.content}</p>
            </div>
            <div
              onClick={() =>
                router.push({
                  pathname: `/opinions/${hotIssue.opinions[0]?.id}`,
                })
              }
              className={s.issueCardComment}
            >
              <p>{hotIssue.opinions[1]?.stance?.title}</p>
              <p>{hotIssue.opinions[1]?.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Main = props => {
  const { issues, me } = props.data;
  const hotIssue = _.maxBy(issues, i => i.opinions.length);
  const other_issues = issues.filter(i => i.id !== hotIssue.id);
  const router = useRouter();

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={s.main}>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>🔥 지금 핫한 이슈</h2>
          <article className={s.issueCardWrap}>
            <section className={s.issueCard}>
              <HotIssueCard issue={hotIssue} />
            </section>
          </article>
        </div>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>📫 가장 최근 이슈</h2>
          <article className={s.article}>
            {other_issues.map(issue => (
              <IssueCard issue={issue} key={issue.id} />
            ))}
          </article>
        </div>
      </main>
    </Layout>
  );
};

export default withAuthUser()(Main);
