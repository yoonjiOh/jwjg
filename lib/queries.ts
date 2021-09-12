import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query ($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      firebaseUID
      name
      nickname
      intro
      profileImageUrl
    }
  }
`;

export const GET_OPINION_REACTS_AND_COMMENTS = gql`
  query opinion($id: Int!) {
    opinions(id: $id) {
      id
      opinionReactsSum
      opinionCommentsSum
    }
  }
`;

export const DO_LIKE_ACTION_TO_OPINION_COMMENT = gql`
  mutation doLikeActionToOpinionComment($userId: Int!, $opinionCommentsId: Int!, $like: Boolean!) {
    doLikeActionToOpinionComment(
      userId: $userId
      opinionCommentsId: $opinionCommentsId
      like: $like
    ) {
      usersId
      opinionCommentsId
      like
    }
  }
`;

export const DO_LIKE_ACTION_TO_OPINION = gql`
  mutation doLikeActionToOpinion($userId: Int!, $opinionsId: Int!, $like: Boolean!) {
    doLikeActionToOpinion(userId: $userId, opinionsId: $opinionsId, like: $like) {
      usersId
      opinionsId
      like
    }
  }
`;

export const GET_STANCES = gql`
  query {
    stances {
      id
      orderNum
      title
    }
  }
`;

export const GET_STANCES_BY_ISSUE = gql`
  query stancesByIssueId($issuesId: Int!) {
    stancesByIssueId(issuesId: $issuesId) {
      id
      title
      orderNum
    }
  }
`;

export const GET_ISSUES = gql`
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

export const SINGLE_UPLOAD_IMG = gql`
  mutation ($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
      url
    }
  }
`;
