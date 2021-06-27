import { gql } from '@apollo/client';

const GET_USERS = gql`
  query($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      firebaseUID
      name
      intro
      profileImageUrl
    }
  }
`;

export { GET_USERS };
