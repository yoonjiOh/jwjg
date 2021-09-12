import s from './users.module.scss';
import React from 'react';

import { useRouter } from 'next/router';

import { gql, useQuery } from '@apollo/client';
import Loading from '../../components/Loading';
import { signIn, useSession } from 'next-auth/client';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../libs/requireAuthentication';
import { User } from 'next-auth';
import { GET_USER_INFO } from './graph_queries';

const GET_USER = gql`
  query userByFirebase($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      name
      nickname
      intro
      profileImageUrl
      userInfo {
        age
        gender
        residence
      }
    }
  }
`;

function UserInfo({ userInfo }) {
  if (!userInfo) {
    return null;
  }

  return (
    <span>
      {userInfo.age}대 {userInfo.gender}, {userInfo.residence && `${userInfo.residence} 거주`}
    </span>
  );
}

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

const WelcomePage = (props: Props) => {
  const router = useRouter();
  console.log('welcome', props.user);
  const user = props.user;
  const { data } = useQuery(GET_USER_INFO, { variables: { userId: user.id } });
  console.log(data);
  const userInfo = data.userInfo;
  // const { data: myData, refetch: refetchUser } = useQuery(GET_USERS, {
  //   variables: { firebaseUID: AuthUser.id },
  // });

  // const userId = myData?.userByFirebase?.id;

  return (
    <div className={s.main} style={{ marginTop: '0', height: '100vh' }}>
      <div className={s.welcomeMessage}>
        <div style={{ fontSize: '5rem', width: '100%', textAlign: 'center', marginBottom: '30px' }}>
          🎉
        </div>
        <h1>가입 완료, 반가워요!</h1>
        <div className={s.welcomeProfileWrapper}>
          <div
            className={s.profileImgContainer}
            style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <img src={user.profileImageUrl} style={{ width: '50%', height: '50%' }} />
          </div>

          <span>{user.nickname}</span>
          <span>@{user.name}</span>
          <UserInfo userInfo={user.userInfo} />

          <div style={{ marginTop: '15px' }}>
            <div>{user.intro}</div>
          </div>
        </div>
      </div>
      <div className={s.buttonsWrapper}>
        <button
          className={s.primary}
          onClick={() => {
            router.push('/');
          }}
        >
          시작하기🎉
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
