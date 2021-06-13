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

import OpinionBox from '../../components/OpinionBox';

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
          orderNum
          title
          orderNum
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

  return {
    props: {
      data: data,
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

const Issue: any = props => {
  const router = useRouter();
  const issue_id = Number(router.query.id);
  const userId = Number(router.query.userId);

  const { loading, error, data } = useQuery(GET_ISSUE, {
    variables: { id: issue_id },
  });

  const [createUserStance, { loading: mutationLoading, error: mutationError }] = useMutation(
    CREATE_USER_STANCE,
  );
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
    const result = await createUserStance({
      variables: {
        usersId: userId,
        issuesId: issue.id,
        stancesId,
      },
    });
    return result;
  };

  const hasMyOpinion = !!issue.opinions.filter(opinion => opinion.usersId === userId).length;

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
          {/* TODO: mutation 후 변경된 데이터로 화면 새로 그리기 */}
          {/* mutation 후에 refetch는 일어남. 그러면 화면은 어떻게 새로 그릴까? */}
          <CurrentStances userStances={issue.userStances} stances={stances} />
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
                query: {
                  issuesId: issue.id,
                  usersId: userId,
                },
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
                  <OpinionBox opinion={opinion} userId={userId} />
                </div>
              ))}
            </div>
            <div className={s.opinionAll}>
              <Link href={`/issues/${issue_id}/opinions`}>모두 보기</Link>
            </div>
          </div>
        </div>
      </main>
      {!hasMyOpinion && (
        <FloatingNewOpinionBtn userId={userId} issueId={issue_id} stancesId={undefined} /> //stancesId 나중에 수정
      )}
    </Layout>
  );
};

export default Issue;
