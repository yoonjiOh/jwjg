import React, { useState } from "react";
import Layout from '../../components/Layout';
import common_style from '../index.module.css';
import style from './users.module.css';
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
    <Layout title={'Registration'} headerInfo={{ headerType: 'editMode' }}>
      <main className={common_style.main}>
        <form onSubmit={handleSubmit}>
          <label className={style.label_default}>
            이메일
          <input type="text" value={email} onChange={handleEmailChange} />
          </label>
          <label className={style.label_default}>
            비밀번호
          <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <input type="submit" value="로그인" className={style.btn_active} />
        </form>

        <button className={style.btn_default}>
          <Link href={`/`}>비밀번호 찾기</Link>
        </button>

        <div>
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