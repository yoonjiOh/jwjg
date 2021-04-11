import React from "react";
import Link from 'next/link';
import style from './users.module.css';
import { startFacebookSigninFlow } from "./lib/users"

function RegistrationWidget() {
    return <div>
        <button className={style.btn_default}>
            <Link href={`/users/email_registration`}>이메일로 시작하기</Link>
        </button>
        <button className={style.btn_default} onClick={startFacebookSigninFlow}>
            Facebook으로 시작하기
        </button>
    </div>;
}

export default RegistrationWidget;