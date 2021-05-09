import Link from 'next/link';
import { useRouter } from 'next/router';

import s from './Layout.module.css';
import Header from './Header';

import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

const CommonHeader = () => {
  const AuthUser = useAuthUser()
  const router = useRouter();

  return (
    <header className={s.header}>
      <h1 className={s.logo}>
        <Link href="/">
          <img
            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/img_logo.svg"
            alt="좌우지간 로고"
          />
        </Link>
      </h1>
      {/* <nav className={s.nav}>
        <Header email={AuthUser.email} signOut={AuthUser.signOut}></Header>
      </nav> */}
      <span
        className={s.actionBtn}
        onClick={() => {
          router.push({ pathname: '/users' });
        }}
      >
        로그인
      </span>
    </header>
  );
};

export default withAuthUser()(CommonHeader);
