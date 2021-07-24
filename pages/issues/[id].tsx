import s from './[id].module.scss';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { withAuthUser, useAuthUser } from 'next-firebase-auth';

import Layout from '../../components/Layout';
import FloatingNewOpinionBtn from '../../components/opinion/FloatingNewOpinionBtn';

import _ from 'lodash';
import CurrentStances from '../../components/issue/CurrentStances';

import OpinionBox from '../../components/OpinionBox';

const GET_ISSUE = gql`
  query issue($id: Int!) {
    issue(id: $id) {
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
        issuesId
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
          usersId
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

const GET_USER = gql`
  query userByFirebaseWithIssuesId($firebaseUID: String, $issuesId: Int) {
    userByFirebaseWithIssuesId(firebaseUID: $firebaseUID, issuesId: $issuesId) {
      id
      firebaseUID
      name
      intro
      profileImageUrl
      myOpinion(issuesId: $issuesId) {
        id
      }
      userStance(issuesId: $issuesId) {
        issuesId
        usersId
        stancesId
        stances {
          id
          title
          orderNum
        }
      }
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($usersId: Int, $issuesId: Int, $stancesId: Int) {
    createUserStance(usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

const UPDATE_OPINION = gql`
  mutation updateOpinion($id: Int!, $stancesId: Int) {
    updateOpinion(id: $id, stancesId: $stancesId) {
      id
    }
  }
`;

const Issue: any = () => {
  const router = useRouter();
  const issueId = Number(router.query.id);

  const {
    loading,
    error,
    data: issueData,
    refetch: refetchIssue,
  } = useQuery(GET_ISSUE, {
    variables: { id: issueId },
  });
  const AuthUser = useAuthUser();
  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: refetchUser,
  } = useQuery(GET_USER, {
    variables: { firebaseUID: AuthUser.id, issuesId: issueId },
  });

  const [createUserStance, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_USER_STANCE);
  const [updateOpinion] = useMutation(UPDATE_OPINION);

  useEffect(() => {
    refetchIssue({ id: issueId });
  }, []);

  if (loading || userLoading) return 'Loading...';
  if (error || userError) return `Error! ${error && error.message}`;

  const issue = issueData.issue;
  const tags = issue.issueHashTags.map(issueHashTag => issueHashTag.hashTags[0].name);
  const userId = userData?.userByFirebaseWithIssuesId?.id;
  const userStance = userData?.userByFirebaseWithIssuesId?.userStance;
  const myStanceId = userData?.userByFirebaseWithIssuesId?.userStance?.stancesId;

  const newStances = issue?.stances.reduce((acc, stance) => {
    const { id, title, fruit } = stance;
    const result = { title: '', sum: 0, fruit };
    for (const userStance of issue.userStances) {
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

  const onStanceClick = async stancesId => {
    if (!userId) {
      router.push('/users');
      return;
    }
    try {
      if (userData.userByFirebaseWithIssuesId.myOpinion) {
        await updateOpinion({
          variables: {
            id: userData.userByFirebaseWithIssuesId.myOpinion.id,
            stancesId: stancesId,
          },
        });
      }
      await createUserStance({
        variables: {
          usersId: userId,
          issuesId: issue.id,
          stancesId,
        },
      });
    } catch (err) {
      console.error('[UPDATE STANCE FAILED: ]', err);
      alert('입장 선택에 오류가 생겼어요! 조금 있다 다시 선택해 주세요');
    }

    refetchIssue({ id: issueId });
    refetchUser({ issuesId: issueId, firebaseUID: AuthUser.id });
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
            <p>🔥&nbsp;&nbsp;{'참여 ' + issue.userStances.length}</p>
            <p>💬&nbsp;&nbsp;{'의견 ' + issue.opinions.length}</p>
          </div>
          <hr />
          {issue.content && (
            <div>
              <h3 className={s.title}>이슈의 맥</h3>
              <p className={s.body}>{issue.content}</p>
              {/* TODO: issue 작성자 추가 */}
            </div>
          )}
          <h3 className={s.title}>지금 여론</h3>
          <CurrentStances userStances={issue.userStances} stances={newStances} withStats={true} />
          <div>
            <h3 className={s.title}>내 입장</h3>
            <ul className={s.stancePickItems}>
              {issue.stances.map(stance => (
                <li
                  className={
                    `${s.stancePickItem}` +
                    ' ' +
                    `${stance.id === myStanceId ? s[stance.fruit] : ''}`
                  }
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
                  issueId: issue.id,
                },
              });
            }}
          >
            <div>
              <h3 className={s.title}>의견</h3>
              <p className={s.opinionSum}>{issue.opinions.length}</p>
            </div>
            <div className={s.opinionNext}></div>
          </div>
          <div className={s.opinionsContainer}>
            <div className={s.opinionNextContainer} style={{ margin: '0 -20px' }}>
              {issue.opinions.map(opinion => (
                <div key={opinion.id} className={s.opinionContainer}>
                  {/* @ts-ignore */}
                  <OpinionBox opinion={opinion} userStance={userStance} />
                </div>
              ))}
            </div>
            <div className={s.opinionAll}>
              <div
                onClick={() => {
                  router.push({
                    pathname: '/opinions',
                    query: {
                      issueId: issue.id,
                    },
                  });
                }}
              >
                모두 보기
              </div>
            </div>
          </div>
        </div>
        {!!userId && <FloatingNewOpinionBtn issueId={issueId} stancesId={myStanceId} />}
      </main>
    </Layout>
  );
};

export default withAuthUser()(Issue);
