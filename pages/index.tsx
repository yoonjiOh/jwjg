import { gql } from '@apollo/client';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { initializeApollo } from '../apollo/apolloClient';
import CurrentStances from '../components/issue/CurrentStances';
import IssueCard from '../components/IssueCard';
import ServiceCard from '../components/ServiceCard';
import Layout from '../components/Layout';
import { fruits, getFruitForStanceTitle } from '../utils/getFruitForStanceTitle';
import s from './index.module.scss';
import { getSession } from 'next-auth/client';
import { User } from 'next-auth';

const GET_ISSUES_AND_OPINIONS = gql`
  query {
    publishedIssues {
      id
      title
      imageUrl
      isHotIssue
      stances {
        id
        title
        orderNum
      }
      opinions {
        id
        userId
        content
        stancesId
        stance {
          title
          orderNum
        }
        user {
          id
          nickname
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

function HotIssueCard({ user, issue: hotIssue }: any) {
  const router = useRouter();
  if (!hotIssue) {
    return null;
  }

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
        {!!hotIssue.userStancesSum && (
          <div className={s.issueCardCommentWrap}>
            <p className={s.commentSum}>💬 의견 {hotIssue.opinionsSum}</p>
            <div className={s.issueCardComments}>
              <div
                onClick={() => {
                  const path = `/issues/${hotIssue.id}/opinions/${hotIssue.opinions[0]?.id}`;
                  if (!user) {
                    router.push(`/users`);
                    return;
                  }
                  router.push({
                    pathname: path,
                  });
                }}
                className={s.issueCardComment}
              >
                <p className={s.issueCardCommentTitle}>
                  {fruits[hotIssue.opinions[0]?.stance?.orderNum] +
                    ' ' +
                    hotIssue.opinions[0]?.stance?.title ?? null}
                </p>
                <p className={s.commentContent}>{hotIssue.opinions[0]?.content ?? null}</p>
                <p className={s.commentUsername}>{hotIssue.opinions[0]?.user.nickname ?? null}</p>
              </div>
              <div
                onClick={() =>
                  router.push({
                    pathname: `issues/${hotIssue.id}/opinions/${hotIssue.opinions[1]?.id}`,
                  })
                }
                className={s.issueCardComment}
              >
                {hotIssue.opinions[1]?.stance ? (
                  <p className={s.issueCardCommentTitle}>
                    {fruits[hotIssue.opinions[1]?.stance?.orderNum] +
                      ' ' +
                      hotIssue.opinions[1]?.stance?.title}
                  </p>
                ) : null}
                <p className={s.commentContent}>{hotIssue.opinions[1]?.content ?? null}</p>
                <p className={s.commentUsername}>{hotIssue.opinions[1]?.user.nickname ?? null}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const issuesData = await apolloClient.query({
    query: GET_ISSUES_AND_OPINIONS,
  });
  const issues = issuesData.data.publishedIssues.map(issue => {
    const { opinions, stances, userStances } = issue;
    let sortedOpinions;
    if (opinions.length <= 2) {
      sortedOpinions = opinions;
    }
    sortedOpinions = _.chain(opinions)
      .sortBy(o => o.opinionReactsSum)
      .slice(0, 2)
      .value();
    const newStances = getFruitForStanceTitle(stances).reduce((acc, stance) => {
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

  const session = await getSession(context);

  if (session && session.user && !session.user.consentToSAt) {
    return {
      redirect: {
        destination: '/users/terms_of_service',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session?.user || null,
      data: {
        issues,
      },
    },
  };
};

interface Props {
  user: User;
  data: any;
}

const Main = (props: Props) => {
  const issues = props.data.issues;
  const hotIssue = _.find(issues, i => i.isHotIssue == true);
  const other_issues = issues.filter(i => i.id !== hotIssue.id);

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={s.main}>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>🔥 지금 핫한 이슈</h2>
          <article className={s.issueCardWrap}>
            <section className={s.issueCard}>
              <HotIssueCard issue={hotIssue} user={props.user} />
            </section>
          </article>
        </div>
        <div className={s.issueWrap}>
          <h2 className={s.issue}>📫 가장 최근 이슈</h2>
          <article className={s.article}>
            <ServiceCard />
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
