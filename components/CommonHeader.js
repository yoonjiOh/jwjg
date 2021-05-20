import Link from 'next/link';
import s from './Layout.module.css';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';

const CommonHeader = () => {
  const AuthUser = useAuthUser();

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
      {!AuthUser.email ? (
        <Link href="/users">
          <span className={s.actionBtn}>로그인</span>
        </Link>
      ) : (
        <button
          onClick={() => {
            AuthUser.signOut();
          }}
        >
          <span className={s.actionBtn}>로그아웃</span>
        </button>
      )}
    </header>
  );
};

export default withAuthUser()(CommonHeader);
