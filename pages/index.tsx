import React from 'react';
import s from './index.module.css';
import { initializeApollo } from '../apollo/apolloClient';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import _ from 'lodash';
import Layout from '../components/Layout';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';

const GET_ISSUES_AND_OPINIONS = gql`
  query {
    issues {
      id
      title
      imageUrl
      opinions {
        id
        usersId
        content
        user {
          id
          name
        }
      }
    }
  }
`;

export const getServerSideProps = async _context => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_ISSUES_AND_OPINIONS,
  });

  return {
    props: {
      data: data,
    },
  };
};

const Main = props => {
  const { issues } = props.data;
  const hot_issue = _.maxBy(issues, i => i.opinions.length);
  const other_issues = issues
    .map(i => {
      const new_item = { ...i };
      new_item.imageUrl = 'https://image.news1.kr/system/photos/2020/1/7/3998644/article.jpg';
      new_item.opinions = i.opinions.slice(0, 2);
      return new_item;
    })
    .filter(i => i.id !== hot_issue.id);

  const AuthUser = useAuthUser();
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
                          <p>{hot_issue.opinions[0] && hot_issue.opinions[0].usersId}</p>
                          <p>{hot_issue.opinions[0] && hot_issue.opinions[0].content}</p>
                        </div>
                        <div className={s.issueCardComment}>
                          <p>{hot_issue.opinions[1] && hot_issue.opinions[1].usersId}</p>
                          <p>{hot_issue.opinions[1] && hot_issue.opinions[1].content}</p>
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
              <section key={issue.id} className={s.issueCard}>
                <h3 className={s.issueTitle}>
                  <Link key={issue.title} href={`/issues/${issue.id}`}>
                    {issue.title}
                  </Link>
                </h3>
                <div className={s.image}>
                  <img src={issue.imageUrl} />
                </div>
                <div>
                  <div className={s.issueCardTop}>
                    <p className={s.responseSum}>🔥 {''}명 참여</p>
                    <p className={s.barchart}></p>
                  </div>
                  <div className={s.line}></div>
                  <div className={s.issueCardCommentWrap}>
                    <p className={s.commentSum}>💬 글 {''}개</p>
                    {issue.opinions.length > 0 && issue.opinions[1] && (
                      <div className={s.issueCardComments}>
                        <div className={s.issueCardComment}>
                          <p>{issue.opinions[0].author_id}</p>
                          <p>{issue.opinions[0].content}</p>
                        </div>
                        <div className={s.issueCardComment}>
                          <p>{issue.opinions[1].author_id}</p>
                          <p>{issue.opinions[1].content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
    </Layout>
  );
};

export default Main;
