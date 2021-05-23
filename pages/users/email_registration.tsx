import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';

import common_style from '../index.module.css';
import s from './users.module.scss';

import { doEmailSignup } from './lib/users.ts';

function EmailRegistration() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const router = useRouter();

  const handleEmailChange = event => setEmail(event.target.value);
  const handlePasswordChange = event => setPwd(event.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    const ret = await doEmailSignup(email, pwd);
    console.log('succeeded!:' + ret);
    if (ret == true) {
      router.push('/users/additional_information');
    }
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '회원가입',
    action: (
      <button className={s.registerBtn} onClick={handleSubmit}>
        다음
      </button>
    ),
  };

  return (
    <Layout title={'registration'} headerInfo={headerInfo}>
      <main className={common_style.main}>
        <form onSubmit={handleSubmit} className={s.formWrapper}>
          <label>
            이메일
            <input
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일 주소"
              className={s.inputForm}
            />
          </label>
          <br />
          <label>
            비밀번호
            <input
              name="email"
              type="password"
              value={pwd}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className={s.inputForm}
            />
          </label>
          <div className={s.passwordMessage}>숫자 포함, 영문 포함, 8자 이상</div>
          <br />
        </form>
      </main>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(EmailRegistration);
