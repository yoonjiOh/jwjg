import Link from 'next/link';
import s from './Layout.module.css';
import Header from './Header';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

const CommonHeader = () => {
  const AuthUser = useAuthUser()

  return (
    <div>
      <header className={s.header}>
        <h1 className={s.logo}>
          <Link href="/">JWJG</Link>
        </h1>
        <nav className={s.nav}>
          <Header email={AuthUser.email} signOut={AuthUser.signOut}></Header>
        </nav>
      </header>
    </div>
  );
};

export default withAuthUser()(CommonHeader);
