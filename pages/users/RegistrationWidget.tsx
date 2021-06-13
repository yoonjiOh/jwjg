import React from "react";
import Link from 'next/link';
import s from './users.module.scss';
import { startFacebookSigninFlow } from '../../lib/users';

function RegistrationWidget() {
    return (
      <div className={s.registrationWidgetWrapper}>
        <button className={s.btnDefault}>
          <Link href={`/users/email_registration`}>이메일로 시작하기</Link>
        </button>
        <button className={s.btnFacebook} onClick={startFacebookSigninFlow}>
          Facebook으로 시작하기
        </button>
      </div>
    );
}

export default RegistrationWidget;