import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../../components/Layout';
import style from './index.module.css';
import Loading from '../../../components/Loading';
import { useRouter } from 'next/router';
import { User } from 'next-auth';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../../lib/requireAuthentication';
import Link from 'next/link';

const GET_ISSUES = gql`
  query FetchIssues {
    issues {
      id
      title
      isPublished
      isHotIssue
    }
  }
`;

export const MANAGE_ISSUE_PUBLISH_STATUS = gql`
  mutation manageIssuePublishStatus($id: Int!, $isPublished: Boolean!) {
    manageIssuePublishStatus(id: $id, isPublished: $isPublished) {
      id
      isPublished
    }
  }
`;

export const DELETE_ISSUE = gql`
  mutation deleteIssue($id: Int!) {
    deleteIssue(id: $id) {
      id
      isDeleted
    }
  }
`;

export const MANAGE_APPROVE_HOT_ISSUE = gql`
  mutation manageApproveHotIssue($id: Int!, $isHotIssue: Boolean!) {
    manageApproveHotIssue(id: $id, isHotIssue: $isHotIssue) {
      id
      isHotIssue
    }
  }
`;

export const MANAGE_ROLLBACK_HOT_ISSUE = gql`
  mutation manageRollbackHotIssue($id: Int!, $isHotIssue: Boolean!) {
    manageRollbackHotIssue(id: $id, isHotIssue: $isHotIssue) {
      id
      isHotIssue
    }
  }
`;

const ISSUE_PUBLISHED_STATUS = {
  rollbackPublishing: false,
  approvePublishing: true,
};

const HOT_ISSUE_STATUS = {
  rollbackHotIssue: false,
  approveHotIssue: true,
};

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    if (!context.user.isAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

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

const IssueList = (props: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_ISSUES);
  const [manageIssuePublishStatus, { data: publishStatus }] = useMutation(
    MANAGE_ISSUE_PUBLISH_STATUS,
  );
  const [deleteIssue, { data: isDeleted }] = useMutation(DELETE_ISSUE);
  const [manageApproveHotIssue, { data: isApproveHotIssue }] =
    useMutation(MANAGE_APPROVE_HOT_ISSUE);
  const [manageRollbackHotIssue, { data: isRollbackHotIssue }] =
    useMutation(MANAGE_ROLLBACK_HOT_ISSUE);
  const [hotIssueId, setHotIssueId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    data &&
      data.issues.map(issue => {
        if (issue.isHotIssue) {
          setHotIssueId(issue.id);
        }
      });
  });

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  const handleClickManagePublishingBtn = async (issueId, status) => {
    await manageIssuePublishStatus({
      variables: {
        id: issueId,
        isPublished: status,
      },
    }).then(() => {
      refetch();
    });
  };

  const handleClickDeleteIssueBtn = async issueId => {
    await deleteIssue({
      variables: {
        id: issueId,
      },
    }).then(() => {
      refetch();
    });
  };

  const handleClickManageHotIssueBtn = async (issueId, status) => {
    await manageApproveHotIssue({
      variables: {
        id: issueId,
        isHotIssue: status,
      },
    }).then(() => {
      handleRollbackHotIssue(hotIssueId, HOT_ISSUE_STATUS.rollbackHotIssue);
    });
  };

  const handleRollbackHotIssue = async (issueId, status) => {
    await manageRollbackHotIssue({
      variables: {
        id: issueId,
        isHotIssue: status,
      },
    }).then(() => {
      refetch();
    });
  };

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={style.main}>
        <div className={style.wrapper}>
          {/* 
          TODO(jurampark): Need to implement
          <Link href={`/admin/create_user`}>
            <span className={style.button}>?????? ?????????</span>
          </Link> */}
          {data &&
            data.issues.map(issue => (
              <div key={issue.title} className={style.issue_title}>
                <a
                  key={issue.title}
                  onClick={() => {
                    router.push({
                      pathname: '/admin/issues/[id]',
                      query: { id: issue.id },
                    });
                  }}
                >
                  {issue.title}
                </a>
                {issue.isPublished ? (
                  <button
                    className={style.button}
                    onClick={() =>
                      handleClickManagePublishingBtn(
                        issue.id,
                        ISSUE_PUBLISHED_STATUS.rollbackPublishing,
                      )
                    }
                  >
                    ?????? ?????????
                  </button>
                ) : (
                  <button
                    className={style.button}
                    onClick={() =>
                      handleClickManagePublishingBtn(
                        issue.id,
                        ISSUE_PUBLISHED_STATUS.approvePublishing,
                      )
                    }
                  >
                    ?????? ?????? ??????
                  </button>
                )}
                <button
                  className={style.button}
                  onClick={() => handleClickDeleteIssueBtn(issue.id)}
                >
                  ????????????
                </button>
                {issue.isPublished && !issue.isHotIssue ? (
                  <button
                    className={style.button}
                    onClick={() =>
                      handleClickManageHotIssueBtn(issue.id, HOT_ISSUE_STATUS.approveHotIssue)
                    }
                  >
                    ????????? ??????
                  </button>
                ) : (
                  <span></span>
                )}
              </div>
            ))}
        </div>
      </main>
    </Layout>
  );
};

export default IssueList;
