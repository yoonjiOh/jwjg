import { signIn } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
// import { startFacebookSigninFlow } from '../../lib/users';
import s from './users.module.scss';

function RegistrationWidget() {
  // const router = useRouter();

  // const handleFacebookLogin = async e => {
  //   e.preventDefault();
  //   try {
  //     await startFacebookSigninFlow();
  //   } catch (err) {
  //     console.log(err);
  //     return;
  //   }
  // };

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
