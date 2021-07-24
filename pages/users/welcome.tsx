import s from './users.module.scss';
import React from 'react';

import { useRouter } from 'next/router';
import { withAuthUser, useAuthUser } from 'next-firebase-auth';

import { gql, useQuery } from '@apollo/client';

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

const welcomePage = () => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  const { data: userData } = useQuery(GET_USER, {
    variables: { firebaseUID: AuthUser.id },
  });

  const user = userData?.userByFirebase;

  if (!user) {
    return <div>Loading...</div>;
  }

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
          <span>
            {user.userInfo.age}대 {user.userInfo.gender},{' '}
            {user.userInfo.residence && `${user.userInfo.residence} 거주`}
          </span>

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

export default withAuthUser()(welcomePage);
