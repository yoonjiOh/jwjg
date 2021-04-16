import React, { useState } from "react";
import Layout from '../../components/Layout';
import common_style from '../index.module.css';
import s from './users.module.css';
import Link from 'next/link';
import RegistrationWidget from './RegistrationWidget'
import { useAuth } from './lib/users';

const LoginForm = () => {
  const auth = useAuth();
  const [state, setState] = useState({ email: '', password: '' });
  const { email, password } = state;

  const handleEmailChange = (event) => {
    setState(prevState => {
      return { ...prevState, email: event.target.value }
    });
  }

  const handlePasswordChange = (event) => {
    setState(prevState => {
      return { ...prevState, password: event.target.value }
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    auth.doEmailLogin(email, password);
  }

  return (
    <Layout title={'Registration'} headerInfo={{ headerType: 'common' }}>
      <main className={common_style.main}>
        <div className={s.greetingWrapper}>
          <h3>좌우지간</h3>
          <p>우리 이제 화해해요😫</p>
          <p>싸우기 싫은 사회 SNS, 좌우지간</p>
        </div>
        <form onSubmit={handleSubmit} className={s.formWrapper}>
          <input type="text" 
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일"
            className={s.inputForm}
          />
          <input type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
            className={s.inputForm}
          />
          <input type="submit" value="로그인" className={s.btnActive} />
          <button className={s.btnLink}>
            <Link href={`/`}>비밀번호 찾기</Link>
          </button>
        </form>

        <div className={s.formWrapper}>
          <RegistrationWidget />
        </div>

        {/* <button className={style.btn_default}>
          <Link href={`/users/registration`}>이메일로 시작하기</Link>
        </button>
        <button className={style.btn_default}>
          <Link href={`/`}>Facebook으로 시작하기</Link>
        </button> */}
      </main>
    </Layout>
  );
}

export default LoginForm;