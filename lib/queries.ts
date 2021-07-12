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
  mutation doLikeActionToOpinionComment($usersId: Int!, $opinionCommentsId: Int!, $like: Boolean!) {
    doLikeActionToOpinionComment(
      usersId: $usersId
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
  mutation doLikeActionToOpinion($usersId: Int!, $opinionsId: Int!, $like: Boolean!) {
    doLikeActionToOpinion(usersId: $usersId, opinionsId: $opinionsId, like: $like) {
      usersId
      opinionsId
      like
    }
  }
`;
