import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import style from './index.module.css';
import Loading from '../../../components/Loading';

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
  mutation manageIssuePublishStatus(
    $id: Int!
    $isPublished: Boolean!
  ) {
    manageIssuePublishStatus(
      id: $id,
      isPublished: $isPublished
    ) {
      id
      isPublished
    }
  }
`;

export const DELETE_ISSUE = gql`
  mutation deleteIssue($id: Int!) {
    deleteIssue(id: $id) {
      id,
      isDeleted
    }
  }
`;

export const MANAGE_APPROVE_HOT_ISSUE = gql`
  mutation manageApproveHotIssue(
    $id: Int!
    $isHotIssue: Boolean!
  ) {
    manageApproveHotIssue(
      id: $id,
      isHotIssue: $isHotIssue
    ) {
      id,
      isHotIssue
    }
  }
`;

export const MANAGE_ROLLBACK_HOT_ISSUE = gql`
  mutation manageRollbackHotIssue(
    $id: Int!
    $isHotIssue: Boolean!
  ) {
    manageRollbackHotIssue(
      id: $id,
      isHotIssue: $isHotIssue
    ) {
      id,
      isHotIssue
    }
  }
`;

const ISSUE_PUBLISHED_STATUS = {
  rollbackPublishing: false,
  approvePublishing: true,
}

const HOT_ISSUE_STATUS = {
  rollbackHotIssue: false,
  approveHotIssue: true,
}

const IssueList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ISSUES);
  const [manageIssuePublishStatus, { data: publishStatus }] = useMutation(MANAGE_ISSUE_PUBLISH_STATUS);
  const [deleteIssue, { data: isDeleted }] = useMutation(DELETE_ISSUE);
  const [manageApproveHotIssue, { data: isApproveHotIssue }] = useMutation(MANAGE_APPROVE_HOT_ISSUE);
  const [manageRollbackHotIssue, { data: isRollbackHotIssue }] = useMutation(MANAGE_ROLLBACK_HOT_ISSUE);
  const [hotIssueId, setHotIssueId] = useState(null);

  useEffect(() => {
    data && data.issues.map(issue => {
      if (issue.isHotIssue) {
        setHotIssueId(issue.id)
      }
    })
  });

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  const handleClickManagePublishingBtn = async (issueId, status) => {
    await manageIssuePublishStatus({
      variables: {
        id: issueId,
        isPublished: status,
      }
    }).then(() => {
      refetch();
    });
  }

  const handleClickDeleteIssueBtn = async (issueId) => {
    await deleteIssue({
      variables: {
        id: issueId,
      }
    }).then(() => {
      refetch();
    })
  }

  const handleClickManageHotIssueBtn = async (issueId, status) => {
    await manageApproveHotIssue({
      variables: {
        id: issueId,
        isHotIssue: status,
      }
    }).then(() => {
      handleRollbackHotIssue(hotIssueId, HOT_ISSUE_STATUS.rollbackHotIssue);
    })
  }

  const handleRollbackHotIssue = async (issueId, status) => {
    await manageRollbackHotIssue({
      variables: {
        id: issueId,
        isHotIssue: status,
      }
    }).then(() => {
      refetch();
    })
  }


  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={style.main}>
        <div className={style.wrapper}>
          {data && data.issues.map(issue => (
            <div key={issue.title} className={style.issue_title}>
              <Link key={issue.title} href={`/admin/issues/${issue.id}`}>
                {issue.title}
              </Link>
              {
                issue.isPublished ?
                  <button className={style.button}
                    onClick={() => handleClickManagePublishingBtn(issue.id, ISSUE_PUBLISHED_STATUS.rollbackPublishing)}>
                    이슈 재검토</button> :
                  <button className={style.button}
                    onClick={() => handleClickManagePublishingBtn(issue.id, ISSUE_PUBLISHED_STATUS.approvePublishing)}>
                    이슈 발제 승인</button>
              }
              <button className={style.button}
                onClick={() => handleClickDeleteIssueBtn(issue.id)}>삭제하기</button>
              {
                issue.isPublished && !issue.isHotIssue ? (
                  <button className={style.button}
                    onClick={() => handleClickManageHotIssueBtn(issue.id, HOT_ISSUE_STATUS.approveHotIssue)}>
                    핫이슈 선택</button>
                ) : <span></span>
              }
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default IssueList;
