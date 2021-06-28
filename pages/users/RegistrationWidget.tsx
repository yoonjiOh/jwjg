import React from 'react';
import Link from 'next/link';
import s from './users.module.scss';
import { startFacebookSigninFlow } from '../../lib/users';

function RegistrationWidget() {
  return (
    <div className={s.registrationWidgetWrapper}>
      <Link href={`/users/email_registration`}>
        <button className={s.btnDefault}>이메일로 시작하기</button>
      </Link>
      <button className={s.btnFacebook} onClick={startFacebookSigninFlow}>
        Facebook으로 시작하기
      </button>
    </div>
  );
}

export default RegistrationWidget;
