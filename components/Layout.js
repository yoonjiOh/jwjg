import Head from 'next/head';
import s from './Layout.module.css';
import Link from 'next/link';
import Header from './Header';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

const Layout = ({ title, children }) => {
  const AuthUser = useAuthUser()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.logo}>
            <Link href="/">JWJG</Link>
          </h1>
          <nav className={s.nav}>
            <Header email={AuthUser.email} signOut={AuthUser.signOut}></Header>
          </nav>
          {/* <nav className={s.nav}>
            <ol>
              <li className={s.menuItem}>
                <Link href="/users/profile">프로필</Link>
              </li>
              <li className={s.menuItem}>
                <Link href="/issue">이슈 관리</Link>
              </li>
            </ol>
          </nav> */}
        </header>
        {children}
      </div>
    </>
  );
};

export default withAuthUser()(Layout)
