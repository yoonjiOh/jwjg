import React from 'react';
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

const ISSUE_PUBLISHED_STATUS = {
  rollbackPublishing: false,
  approvePublishing: true,
}

const IssueList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ISSUES);
  const [manageIssuePublishStatus, { data: publishStatus }] = useMutation(MANAGE_ISSUE_PUBLISH_STATUS);
  const [deleteIssue, { data: isDeleted }] = useMutation(DELETE_ISSUE);

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
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default IssueList;
