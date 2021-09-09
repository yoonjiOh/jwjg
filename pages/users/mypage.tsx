import { gql } from '@apollo/client';
import { Users } from '@prisma/client';
import _ from 'lodash';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { initializeApollo } from '../../apollo/apolloClient';
import Divider from '../../components/Divider';
import HashTag from '../../components/HashTag';
import Layout from '../../components/Layout';
import OpinionSummaryBox from '../../components/OpinionSummaryBox';
import { GET_ISSUES, GET_STANCES, GET_USERS } from '../../lib/queries';
import s from './users.module.scss';

const GET_MYPAGE_DATA = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      name
      intro
      profileImageUrl
      isAdmin
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

function UserPage(props) {
  if (!props.user) {
    return null;
  }
  const router = props.router;
  const user = props.user;
  const tagsMap = props.tagsMap;

  return (
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
            });
          }}
        >
          프로필 편집
        </button>
        {
          user?.isAdmin ? <button
            style={{ marginTop: '10px' }}
            onClick={() => {
              router.push('/admin/issues/new');
            }}
          >
            이슈 발제하기
        </button> : null
        }

      </div>
      <Divider />

      <div>
        <div
          className={s.hashTagsContainer}
          onClick={() => {
            router.push({
              pathname: '/users/myhashtags',
            });
          }}
        >
          <h3 className={s.title}>해시태그</h3>
          <p className={s.hashTagSum}>{_.size(tagsMap)}</p>
          <div className={s.goNext} />
          {!_.isEmpty(tagsMap) && (
            <div className={s.tags}>
              {_.map(tagsMap, (value, key) => {
                return <HashTag tag={key} key={key} count={value} />;
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
              key={opinion.id}
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
  );
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const {
    error,
    data: { userByFirebase: userData },
  }: { error?: any, data: { userByFirebase: Users } } = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });

  if (!userData) {
    return null;
  }

  const userId = userData.id;
  const { data } = await apolloClient.query({
    query: GET_MYPAGE_DATA,
    variables: { id: userId },
  });

  const issues = await apolloClient.query({
    query: GET_ISSUES,
  });

  const stances = await apolloClient.query({
    query: GET_STANCES,
  });

  return {
    props: {
      user: userData,
      data: data,
      issues_data: issues.data,
      stances_data: stances.data,
    },
  };
});

interface Props {
  data: any;
  issues_data: any;
  stances_data: any;
  children?: ReactNode;
  user: any;
}

const MyPage = (props: Props) => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  // useEffect(() => {
  //   if (!props.data) {
  //     // AuthUser.signOut();
  //     // router.push('/');
  //   }
  // }, []);

  if (!props.data) {
    AuthUser.signOut().then(() => {
      router.push('/');
    });
  }

  const tagsMap = {};
  const user = props.user;
  if (props.data && user) {
    const relatedIssueIds = _.uniq(
      props.data.user.opinions.map(opinion => opinion.issuesId),
      props.data.user.userStances.map(stance => stance.issuesId),
    );

    relatedIssueIds.map(issueId => {
      const matchIssue = _.find(props.issues_data.issues, issue => issue.id === issueId);
      if (matchIssue && matchIssue.issueHashTags.length) {
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
  }

  return (
    <Layout title={'마이페이지'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <UserPage user={props.user} router={router} tagsMap={tagsMap} />
    </Layout>
  );
};

export default withAuthUser()(MyPage);
