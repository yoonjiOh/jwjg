import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query users {
    users {
      id
      email
      name
      nickname
    }
  }
`;

export const GET_USERS = gql`
  query ($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      firebaseUID
      name
      nickname
      intro
      image
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
  mutation doLikeActionToOpinionComment(
    $userId: String!
    $opinionCommentsId: Int!
    $like: Boolean!
  ) {
    doLikeActionToOpinionComment(
      userId: $userId
      opinionCommentsId: $opinionCommentsId
      like: $like
    ) {
      userId
      opinionCommentsId
      like
    }
  }
`;

export const DO_LIKE_ACTION_TO_OPINION = gql`
  mutation doLikeActionToOpinion($userId: String!, $opinionsId: Int!, $like: Boolean!) {
    doLikeActionToOpinion(userId: $userId, opinionsId: $opinionsId, like: $like) {
      userId
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

export const GET_OPINIONS = gql`
  query Opinions($id: Int!) {
    opinions(id: $id) {
      id
      content
      issuesId
      issueStances {
        id
        title
        orderNum
        issuesId
      }
      stancesId
      stance {
        id
        orderNum
        title
      }
      createdAt
      user {
        id
        name
        nickname
        intro
        image
      }
      opinionComments {
        id
        content
        createdAt
        userId
        stancesId
        stance {
          id
          orderNum
          title
        }
        user {
          id
          name
          intro
          image
        }
      }
      opinionReacts {
        like
        userId
      }
      opinionReactsSum
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo(
    $id: String!
    $name: String
    $nickname: String
    $intro: String
    $image: String
    $consentToSAt: DateTime
  ) {
    updateUserInfo(
      id: $id
      name: $name
      nickname: $nickname
      intro: $intro
      image: $image
      consentToSAt: $consentToSAt
    ) {
      id
      name
      nickname
      intro
      image
      consentToSAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($email: String!, $name: String, $nickname: String) {
    createUser(email: $email, name: $name, nickname: $nickname) {
      email
      name
      nickname
    }
  }
`;

export const CREATE_USER_INFO = gql`
  mutation createUserInfo($userId: String!, $age: Int, $gender: String, $residence: String) {
    createUserInfo(userId: $userId, age: $age, gender: $gender, residence: $residence) {
      age
      gender
      residence
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      name
      intro
      image
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

export const GET_USER_INFO = gql`
  query UserInfo($userId: String!) {
    userInfo(userId: $userId) {
      age
      gender
      residence
    }
  }
`;

export const GET_USER_STANCE = gql`
  query UserStance($userId: String!, $issuesId: Int!) {
    userStance(userId: $userId, issuesId: $issuesId) {
      userId
      issuesId
      stancesId
      stances {
        id
        title
        orderNum
      }
    }
  }
`;
