import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { getFacebookLoginResult, startFacebookSigninFlow } from '../../lib/users';
import s from './users.module.scss';

function RegistrationWidget() {
  const router = useRouter();

  const handleFacebookLogin = async e => {
    e.preventDefault();
    try {
      await startFacebookSigninFlow();
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <div className={s.registrationWidgetWrapper}>
      <Link href={`/users/email_registration`}>
        <button className={s.btnDefault}>이메일로 시작하기</button>
      </Link>
      <button className={s.btnFacebook} onClick={handleFacebookLogin}>
        Facebook으로 시작하기
      </button>
    </div>
  );
}

export default RegistrationWidget;
