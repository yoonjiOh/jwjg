import Layout from '../../components/Layout';
import Divider from '../../components/Divider';
import OpinionSummaryBox from '../../components/OpinionSummaryBox';
import HashTag from '../../components/HashTag';

import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';
import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { GET_USERS } from '../../queries';

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
      userStances {
        issuesId
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
      issueHashTags {
        hashTags {
          name
        }
      }
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

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const meData = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });
  const userId = meData?.data?.userByFirebase?.id;
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
});

const MyPage = props => {
  const { user } = props.data;
  const router = useRouter();
  const relatedIssueIds = _.uniq(
    props.data.user.opinions.map(opinion => opinion.issuesId),
    props.data.user.userStances.map(stance => stance.issuesId),
  );

  const tagsMap = {};

  relatedIssueIds.map(issueId => {
    const matchIssue = _.find(props.issues_data.issues, issue => issue.id === issueId);
    if (matchIssue.issueHashTags.length) {
      matchIssue.issueHashTags.forEach(issueHashTag => {
        const targetTag = issueHashTag.hashTags[0].name;

        if (tagsMap[targetTag]) {
          tagsMap[targetTag]++;
        } else {
          tagsMap[targetTag] = 1;
        }
      });
    }
  });

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
            <span
              onClick={() => {
                router.push(`/users/myopinions`);
              }}
            >
              의견
            </span>
            <span className={s.count}>
              {user && user.opinionComments && user.opinionComments.length}
            </span>
            <span
              onClick={() => {
                router.push(`/users/mycomments`);
              }}
            >
              댓글
            </span>
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
                pathname: '/users/myhashtags',
                query: { userId: user && user.id },
              });
            }}
          >
            <h3 className={s.title}>해시태그</h3>
            <p className={s.hashTagSum}>{_.size(tagsMap)}</p>
            <div className={s.goNext} />
            {!_.isEmpty(tagsMap) && (
              <div className={s.tags}>
                {_.map(tagsMap, (value, key) => {
                  return <HashTag tag={key} count={value} />;
                })}
              </div>
            )}
          </div>
        </div>

        <div className={s.myOpinionsWrapper}>
          <div
            className={s.hashTagsContainer}
            onClick={() => {
              router.push(`/users/myopinions`);
            }}
          >
            <h3 className={s.title}>작성한 의견</h3>
            <p className={s.hashTagSum}>{user && user.opinions && user.opinions.length}</p>
            <div className={s.goNext} />
          </div>

          {user && user.opinions && user.opinions.length ? (
            user.opinions.map(opinion => (
              <OpinionSummaryBox
                opinion={opinion}
                issues={props.issues_data.issues}
                stances={props.stances_data.stances}
              />
            ))
          ) : (
            <div className={s.noOpinions}>
              <p>아직 작성한 의견이 없어요 🍊</p>
              <img src={'https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/Capybara2.png'} />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default MyPage;
