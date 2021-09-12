import { gql } from '@apollo/client';

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo(
    $id: String!
    $name: String
    $nickname: String
    $intro: String
    $profileImageUrl: String
  ) {
    updateUserInfo(
      id: $id
      name: $name
      nickname: $nickname
      intro: $intro
      profileImageUrl: $profileImageUrl
    ) {
      id
      name
      nickname
      intro
      profileImageUrl
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

export const GET_USER_INFO = gql`
  query ($userId: String) {
    userInfo(userId: $userId) {
      age
      gender
      residence
    }
  }
`;
