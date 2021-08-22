import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import s from './Layout.module.css';

const CommonHeader = ({ isDimmed }) => {
  const AuthUser = useAuthUser();
  const router = useRouter();

  return (
    <header className={isDimmed ? s.header + ' loading-transparent-overlay' : s.header}>
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
        <div>
          <button
            onClick={() => {
              AuthUser.signOut();
              router.push({
                pathname: '/',
              });
            }}
            style={{ background: 'none', border: 'none' }}
          >
            <span className={s.actionBtn}>로그아웃</span>
          </button>
          <Link href={`/users/mypage`}>
            <span className={s.actionBtn}>마이페이지</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default withAuthUser()(CommonHeader);
