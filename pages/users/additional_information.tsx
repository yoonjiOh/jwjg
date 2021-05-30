import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import common_style from '../index.module.css';

import { doEmailSignup } from './lib/users';

function AdditionalInformation() {
  const router = useRouter();
  const AuthUser = useAuthUser();
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');

  const handleNameChange = event => setName(event.target.value);
  const handleIntroChange = event => setIntro(event.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    // handle user info update mutation using useMutation hook.
    router.push('/');
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
            <form onSubmit={handleSubmit}>
              <label>
                intro
                <input name="intro" value={intro} onChange={handleIntroChange} placeholder="내소개" />
              </label>
              <br />
              <label>
                name
                <input name="name" value={name} onChange={handleNameChange} placeholder="내소개" />
              </label>
              <br />

              {/* <label>
          intro
          <input
            name="profile"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일 주소"
          />
        </label> */}
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
