import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query($firebaseUID: String) {
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
