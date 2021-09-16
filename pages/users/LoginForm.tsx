import { signIn } from 'next-auth/client';
import React, { useState } from 'react';
import Layout from '../../components/Layout';
// import { doEmailLogin } from '../../lib/users';
import common_style from '../index.module.scss';
import RegistrationWidget from './RegistrationWidget';
import s from './users.module.scss';

const LoginForm = () => {
  const [state, setState] = useState({ email: '' });
  const { email } = state;

  const handleEmailChange = event => {
    setState(prevState => {
      return { ...prevState, email: event.target.value };
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    signIn('email', { email });
  };

  return (
    <Layout title={'login'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={common_style.main}>
        <div className={s.greetingWrapper}>
          <h3>좌우지간</h3>
          <p>우리 이제 화해해요😫</p>
          <p>싸우기 싫은 사회 SNS, 좌우지간</p>
        </div>

        {/* 
        For magic link login.
        
        <form onSubmit={handleSubmit} className={s.formWrapper}>
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일"
            className={s.inputForm}
          />
          <input type="submit" value="로그인" className={s.btnActive} />
        </form> */}

        <RegistrationWidget />

        <img
          alt="로그인 대문이미지"
          src={'https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/Capybara1.png'}
          style={{ display: 'flex', margin: '0 auto', width: '50%' }}
        />
      </main>
    </Layout>
  );
};

export default LoginForm;
