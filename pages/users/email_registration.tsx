import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';

import common_style from '../index.module.scss';
import s from './users.module.scss';

import { validatePassword, firebaseUserSignup, validateEmail } from '../../lib/users';
import { EmailAlreadyExistError, WrongPasswordFormatError } from '../../lib/errors';

function EmailRegistration() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const router = useRouter();

  const handleEmailChange = event => {
    setEmailError('');
    setEmail(event.target.value);
  };

  const handleSignupError = (err: Error) => {
    if (err instanceof EmailAlreadyExistError) {
      setEmailError(err.message);
    } else if (err instanceof WrongPasswordFormatError) {
      setPwdError(err.message);
    } else {
      throw err; // unknown error, rethrow it.
    }
  };

  const setPassword = (password: string) => {
    setPwdError('');
    setPwd(password);
  };

  const handlePasswordChange = event => {
    const password = event.target.value;
    setPassword(password);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await validateEmail(email);
      await validatePassword(pwd);
      await firebaseUserSignup(email, pwd);
    } catch (err) {
      handleSignupError(err);
      return;
    }

    router.push('/users/terms_of_service');
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
    <Layout title={'registration'} headerInfo={headerInfo} isDimmed={false}>
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
            <span className="error">{emailError}</span>
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
            <span className="error">{pwdError}</span>
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
