import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';

import { UPDATE_PROFILE } from './edit_profile';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER } from '../../components/CommonHeader';

function AdditionalInformation() {
  const router = useRouter();
  const AuthUser = useAuthUser();
  const [name, setName] = useState('');

  const [updateUserProfile] = useMutation(UPDATE_PROFILE);

  const { data: userData } = useQuery(GET_USER, {
    variables: { firebaseUID: AuthUser.id },
  });

  const handleNameChange = event => setName(event.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    // handle user info update mutation using useMutation hook.
    await updateUserProfile({
      variables: {
        id: parseInt(userData.userByFirebase.id),
        name: name,
      },
    })
      .then(result => {
        console.log(result);
      })
      .finally(() => {
        router.push('/');
      });
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '회원가입',
    action: (
      <button
        // className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
        onClick={handleSubmit}
      >
        완료
      </button>
    ),
  };

  return (
    <Layout title={'유저 상세 정보 입력'} headerInfo={headerInfo}>
      <main className={common_style.main}>
        <span>사용자 이름을 정해 주세요</span>
        <form onSubmit={handleSubmit}>
          <label>
            사용자 이름
            <input name="name" value={name} onChange={handleNameChange} placeholder="@" />
          </label>
          <br />
        </form>
      </main>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AdditionalInformation);
