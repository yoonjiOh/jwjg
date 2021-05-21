import Layout from '../../components/Layout';
import Divider from '../../components/Divider';
import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';

const GET_MYPAGE_DATA = gql`
  query user($id: Int!) {
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
    }
  }
`;

const GET_ISSUES = gql`
  query {
    issues {
      id
      title
      imageUrl
    }
  }
`;

const GET_STANCES = gql`
  query {
    stances {
      id
      orderNum
      title
    }
  }
`;

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { userId } = context.query;

  const { data } = await apolloClient.query({
    query: GET_MYPAGE_DATA,
    variables: { id: parseInt(userId) },
  });

  const issues = await apolloClient.query({
    query: GET_ISSUES,
  });

  const stances = await apolloClient.query({
    query: GET_STANCES,
  });

  return {
    props: {
      data: data,
      issues_data: issues.data,
      stances_data: stances.data,
    },
  };
};

const MyPage = props => {
  const { user } = props.data;
  const router = useRouter();

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  return (
    <Layout title={'마이페이지'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        <div className={s.profileWrapper}>
          <div className={s.profileImgContainer}>
            <img src={user && user.profileImageUrl} />
          </div>
          <p>{user && user.name}</p>
          <div>
            <span className={s.count}>{user && user.opinions && user.opinions.length}</span>
            <span>의견</span>
            <span className={s.count}>
              {user && user.opinionComments && user.opinionComments.length}
            </span>
            <span>댓글</span>
          </div>
        </div>

        <hr className={s.divider} />

        <div className={s.profileIntro}>
          <div>{user && user.intro}</div>
          <button
            onClick={() => {
              router.push({
                pathname: 'edit_profile',
                query: { id: user && user.id },
              });
            }}
          >
            프로필 편집
          </button>
        </div>
        <Divider />
        <div>
          <div
            className={s.hashTagsContainer}
            onClick={() => {
              router.push({
                pathname: '/myhashtags',
              });
            }}
          >
            <h3 className={s.title}>해시태그</h3>
            <p className={s.hashTagSum}></p>
            <div className={s.goNext} />
          </div>
        </div>

        <div>
          <div
            className={s.hashTagsContainer}
            onClick={() => {
              router.push({
                pathname: '/myopinions',
              });
            }}
          >
            <h3 className={s.title}>작성한 의견</h3>
            <p className={s.hashTagSum}>{user && user.opinions && user.opinions.length}</p>
            <div className={s.goNext} />
          </div>

          {user &&
            user.opinions &&
            user.opinions.map(opinion => {
              const matchIssue = _.find(props.issues_data.issues, issue => {
                return issue.id === opinion.issuesId;
              });
              const matchStance = _.find(props.stances_data.stances, stance => {
                return stance.id === opinion.stancesId;
              });

              return (
                <div className={s.opinionSummaryBox}>
                  <div className={s.issueImgBox}>
                    <img src={matchIssue.imageUrl} />
                  </div>
                  <div className={s.contextBox}>
                    <p>{matchIssue.title}</p>
                    <span>
                      {fruitsForStanceTitle[matchStance.orderNum]} {matchStance.title}
                    </span>
                    <span>{opinion.content}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </Layout>
  );
};

export default MyPage;
