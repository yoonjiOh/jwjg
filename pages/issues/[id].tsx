import s from './[id].module.scss';

import { useRouter } from 'next/router';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

import Layout from '../../components/Layout';
import FloatingNewOpinionBtn from '../../components/opinion/FloatingNewOpinionBtn';

import Link from 'next/link';
import _ from 'lodash';
import CurrentStances from '../../components/issue/CurrentStances';

import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import CommentBox from '../../components/CommentBox';

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
const GET_ISSUE = gql`
  query issues($id: Int!) {
    issues(id: $id) {
      id
      title
      content
      imageUrl
      stances {
        id
        title
        fruit
      }
      userStances {
        usersId
        stancesId
      }
      opinions {
        id
        content
        stancesId
        createdAt
        usersId
        stance {
          id
          title
        }
        user {
          id
          name
          intro
          profileImageUrl
        }
        opinionReacts {
          like
        }
        opinionComments {
          id
          content
          usersId
          user {
            id
            name
            intro
            profileImageUrl
          }
        }
      }
      issueHashTags {
        hashTags {
          name
        }
      }
    }
  }
`;

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { id } = context.query;
  const { data } = await apolloClient.query({
    query: GET_ISSUE,
    variables: { id: parseInt(id) },
  });
  const users = await apolloClient.query({
    query: GET_USERS,
  });

  return {
    props: {
      data: data,
      users: users.data.users,
    },
  };
};

const CREATE_USER_STANCE = gql`
  mutation createUserStance($usersId: Int, $issuesId: Int, $stancesId: Int) {
    createUserStance(usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

const Issue = props => {
  const router = useRouter();
  const issue_id = Number(router.query.id);

  const AuthUser = useAuthUser();
  const me = _.head(props.users.filter(user => user.firebaseUID === AuthUser.id));

  const { loading, error, data } = useQuery(GET_ISSUE, {
    variables: { id: issue_id },
  });

  const [createUserStance] = useMutation(CREATE_USER_STANCE);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  const issue = data.issues[0];
  const tags = issue.issueHashTags.map(issueHashTag => issueHashTag.hashTags[0].name);
  const userStances = _.reduce(
    issue.userStances,
    (acc, userStance) => {
      if (acc[userStance.stancesId]) {
        acc[userStance.stancesId] += 1;
      } else {
        acc[userStance.stancesId] = 1;
      }
      return acc;
    },
    {},
  );
  const stances = issue.stances.map(stance => ({
    ...stance,
    title: stance.fruit + ' ' + stance.title,
    count: userStances[stance.id] ? userStances[stance.id] : 0,
  }));

  const onStanceClick = async stancesId => {
    const func = await createUserStance({
      variables: {
        // TODO: usersId 상태 가져오는 법 확인 필요
        usersId: 0,
        issuesId: issue.id,
        stancesId,
      },
    });
    _.debounce(func, 250);
  };
  return (
    <Layout title={'개별 이슈'} headerInfo={{ headerType: 'common' }}>
      <main className={s.main}>
        <div className={s.image}>
          <img src={issue.imageUrl} />
        </div>
        <div className={s.issueBody}>
          <div className={s.tags}>
            <ol>
              {tags.map((tag, idx) => (
                <li id={tag + idx} key={tag + idx}>
                  {tag}
                </li>
              ))}
            </ol>
          </div>
          <h2 className={s.issueTitle}>{issue.title}</h2>
          <div className={s.issueSum}>
            <p>🔥 참여 {issue.stances.length}</p>
            <p>💬 의견 {issue.opinions.length}</p>
          </div>
          <hr />
          {issue.content && (
            <div>
              <h3 className={s.title}>이슈의 맥</h3>
              <p>{issue.content}</p>
              {/* TODO: issue 작성자 추가 */}
            </div>
          )}
          <CurrentStances issue={issue} stances={stances} />
          <div>
            <h3 className={s.title}>내 입장</h3>
            <ul className={s.stancePickItems}>
              {stances.map(stance => (
                // TODO: userStances에 저장된 값이 있다면, 선택된 것으로 표시되어야 함
                <li
                  className={s.stancePickItem}
                  key={stance.id}
                  onClick={() => onStanceClick(stance.id)}
                >
                  {stance.title}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={s.opinionTitleContainer}
            onClick={() => {
              router.push({
                pathname: '/opinions',
              });
            }}
          >
            <h3 className={s.title}>의견</h3>
            <p className={s.opinionSum}>{issue.opinions.length}</p>
            <div className={s.opinionNext}></div>
          </div>
          <div className={s.opinionTitleContainer}>
            <div className={s.opinionNextContainer} style={{ margin: '0 -20px' }}>
              {issue.opinions.map(opinion => (
                <div key={opinion.id} className={s.opinionContainer}>
                  <CommentBox comment={opinion} me={me} />
                </div>
              ))}
            </div>
            <div className={s.opinionAll}>
              <Link href={`/issues/${issue_id}/opinions`}>모두 보기</Link>
            </div>
          </div>
        </div>
      </main>
      <FloatingNewOpinionBtn userId={me && me.id} issueId={issue_id} stancesId={1} />
    </Layout>
  );
};

export default withAuthUser()(Issue);
