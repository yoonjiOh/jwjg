import { signIn } from 'next-auth/client';
import React from 'react';
import s from './users.module.scss';

function RegistrationWidget() {
  return (
    <div className={s.registrationWidgetWrapper}>
      <button
        className={s.btnGoogle}
        onClick={() =>
          signIn('google', { callbackUrl: 'http://localhost:3000/users/terms_of_service' })
        }
      >
        Google로 시작하기
      </button>
      <button className={s.btnFacebook} onClick={() => signIn('facebook')}>
        Facebook으로 시작하기
      </button>
    </div>
  );
}

export default RegistrationWidget;
