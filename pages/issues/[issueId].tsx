import s from './[issueId].module.scss';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { gql, useMutation, useQuery } from '@apollo/client';

import Layout from '../../components/Layout';
import FloatingNewOpinionBtn from '../../components/opinion/FloatingNewOpinionBtn';

import _ from 'lodash';
import CurrentStances from '../../components/issue/CurrentStances';

import OpinionBox from '../../components/OpinionBox';
import Loading from '../../components/Loading';
import { fruits, getFruitForStanceTitle } from '../../utils/getFruitForStanceTitle';
import { parseIssueContent } from '../../utils/parseContent';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { GET_USER_DETAILS, GET_USER_STANCE } from '../../lib/graph_queries';
import { initializeApollo } from '../../apollo/apolloClient';
import { User } from 'next-auth';
import { UserStances } from '@prisma/client';

const GET_ISSUE = gql`
  query issue($id: Int!) {
    issue(id: $id) {
      id
      title
      content
      imageUrl
      author {
        id
        name
        nickname
        image
      }
      stances {
        id
        title
        orderNum
      }
      userStances {
        userId
        stancesId
        issuesId
      }
      opinions {
        id
        content
        stancesId
        createdAt
        userId
        stance {
          id
          orderNum
          title
        }
        user {
          id
          name
          nickname
          intro
          image
        }
        opinionReacts {
          userId
          like
        }
        opinionComments {
          id
          content
          userId
          user {
            id
            name
            intro
            image
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

const CREATE_USER_STANCE = gql`
  mutation createUserStance($userId: String, $issuesId: Int, $stancesId: Int) {
    createUserStance(userId: $userId, issuesId: $issuesId, stancesId: $stancesId) {
      userId
      issuesId
      stancesId
    }
  }
`;

const DELETE_USER_STANCE = gql`
  mutation deleteUserStance($userId: String, $issuesId: Int) {
    deleteUserStance(userId: $userId, issuesId: $issuesId) {
      userId
      issuesId
    }
  }
`;

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
  user: User;
}

const Issue: any = (props: Props) => {
  const router = useRouter();
  const issueId = Number(router.query.issueId);

  const {
    loading,
    error,
    data: issueData,
    refetch: refetchIssue,
  } = useQuery(GET_ISSUE, {
    variables: { id: issueId },
  });

  const { 
    data: userStanceData,
    refetch: refetchUserStance,
  } = useQuery(GET_USER_STANCE, {
    variables: { userId: props.user.id, issuesId: issueId },
  });

  const [createUserStance, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_USER_STANCE);

  useEffect(() => {
    refetchIssue({ id: issueId });
    refetchUserStance({ userId: props.user.id, issuesId: issueId });
  }, []);

  const [deleteUserStance, { loading: mutationDeleteLoading, error: mutationDeleteError }] =
    useMutation(DELETE_USER_STANCE);

  if (loading) return <Loading />;
  if (error) return `Error! ${error && error.message}`;

  const issue = issueData.issue;
  const tags = issue.issueHashTags.map(issueHashTag => issueHashTag.hashTags[0].name);
  const userId = props.user.id;
  const userStance = userStanceData?.userStance;
  const myStanceId = userStanceData?.userStance?.stancesId;

  const newStances = getFruitForStanceTitle(issue?.stances).reduce((acc, stance) => {
    const { id, title, fruit } = stance;
    const result = { id, title: '', sum: 0, fruit };
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
      if (userStance?.stancesId === stancesId) {
        await deleteUserStance({
          variables: {
            userId: userId,
            issuesId: issue.id,
          },
        });
      } else {
        await createUserStance({
          variables: {
            userId: userId,
            issuesId: issue.id,
            stancesId,
          },
        });
      }
    } catch (err) {
      console.error('[UPDATE STANCE FAILED: ]', err);
      alert('?????? ????????? ????????? ????????????! ?????? ?????? ?????? ????????? ?????????');
    }

    refetchIssue({ id: issueId });
    refetchUserStance({ userId: props.user.id, issuesId: issueId });
  };

  return (
    <Layout title={'?????? ??????'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={s.main}>
        <div className={s.image}>
          <img src={issue.imageUrl} />
          <div className={s.tags}>
            <ol>
              {tags.map((tag, idx) => (
                <li id={tag + idx} key={tag + idx}>
                  {tag}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className={s.issueBody}>
          <h2 className={s.issueTitle}>{issue.title}</h2>
          <div className={s.issueSum}>
            <Link href={`/issues/${issue.id}/#stance`} scroll={false}>
              <p>&nbsp;&nbsp;{'?????? ' + issue.userStances.length}</p>
            </Link>
            <Link href={`/issues/${issue.id}/#opinion`} scroll={false}>
              <p>????&nbsp;&nbsp;{'?????? ' + issue.opinions.length}</p>
            </Link>
          </div>
          <hr className={s.hr} />
          {issue.content && (
            <div>
              <h3 className={s.title}>????????? ???</h3>
              <div className={s.body}>
                <div dangerouslySetInnerHTML={{ __html: parseIssueContent(issue.content) }}></div>
                <div className={s.authorInfoWrapper}>
                  <div className={s.text}>
                    <span>???????????? | {issue.author.name}</span>
                    <span>{issue.author.nickname}</span>
                  </div>
                  <img src={issue.author.image} />
                </div>
              </div>
            </div>
          )}
          <h3 id="stance" className={s.title}>
            ?????? ??????
          </h3>
          <CurrentStances
            userStances={issue.userStances}
            stances={newStances}
            withStats={true} /* @ts-ignore */
            onStanceClick={onStanceClick}
          />
          <div>
            <h3 className={s.title}>??? ??????</h3>
            <ul className={s.stancePickItems}>
              {issue.stances.map(stance => (
                <li
                  className={
                    `${s.stancePickItem}` +
                    ' ' +
                    `${stance.id === myStanceId ? s[fruits[stance.orderNum]] : s.border}`
                  }
                  key={stance.id}
                  onClick={() => onStanceClick(stance.id)}
                >
                  {fruits[stance.orderNum]}&nbsp;&nbsp;{stance.title}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={s.opinionTitleContainer}
            id="opinion"
            onClick={() => {
              router.push({
                pathname: `/issues/${issue.id}/opinions`,
              });
            }}
          >
            <div>
              <h3 className={s.title}>??????</h3>
              <p className={s.opinionSum}>{issue.opinions.length}</p>
            </div>
            <div className={s.opinionNext}></div>
          </div>
          <div className={s.opinionsContainer}>
            <div className={s.opinionNextContainer} style={{ margin: '0 -20px' }}>
              {issue.opinions.map(opinion => (
                <div key={opinion.id} className={s.opinionContainer}>
                  {/* @ts-ignore */}
                  <OpinionBox user={props.user} opinion={opinion} issueId={issue.id} />
                </div>
              ))}
            </div>
            <div className={s.opinionAll}>
              <div
                onClick={() => {
                  router.push({
                    pathname: `/issues/${issue.id}/opinions`,
                  });
                }}
              >
                ?????? ??????
              </div>
            </div>
          </div>
        </div>
        {!!userId && <FloatingNewOpinionBtn issueId={issueId} stancesId={myStanceId} />}
      </main>
    </Layout>
  );
};

export default Issue;
