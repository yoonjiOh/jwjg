import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { User } from 'next-auth';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { initializeApollo } from '../../apollo/apolloClient';
import Divider from '../../components/Divider';
import HashTag from '../../components/HashTag';
import Layout from '../../components/Layout';
import OpinionSummaryBox from '../../components/OpinionSummaryBox';
import { GET_ISSUES, GET_STANCES, GET_USERS } from '../../lib/graph_queries';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { GET_USER_DETAILS } from '../../lib/graph_queries';
import s from './users.module.scss';

function UserPage(props: any) {
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
          <img src={user && user.image} />
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

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    return {
      props: {
        user: context.user,
      },
    };
  },
);

interface Props {
  children?: ReactNode;
  user: User;
}

const MyPage = (props: Props) => {
  const router = useRouter();

  const { data, loading } = useQuery(GET_USER_DETAILS, { variables: { id: props.user.id } });
  const { data: issues_data, loading: loadingIssues } = useQuery(GET_ISSUES);
  const { data: stances_data, loading: loadingStances } = useQuery(GET_STANCES);

  if (loading || loadingIssues || loadingStances) return null;

  if (!data) {
    signOut();
  }

  const tagsMap = {};
  const user = props.user;
  if (data && user) {
    const relatedIssueIds = _.uniq(
      data.user.opinions?.map(opinion => opinion.issuesId),
      data.user.userStances?.map(stance => stance.issuesId),
    );

    relatedIssueIds.map(issueId => {
      const matchIssue = _.find(issues_data.issues, issue => issue.id === issueId);
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
      <UserPage
        user={props.user}
        router={router}
        tagsMap={tagsMap}
        issues_data={issues_data}
        stances_data={stances_data}
      />
    </Layout>
  );
};

export default MyPage;
