import Head from 'next/head';
import s from './Layout.module.css';
import Link from 'next/link';

const Layout = ({ title, children }) => {
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
            <ol>
              <li className={s.menuItem}>
                <Link href="/profile">프로필</Link>
              </li>
              <li className={s.menuItem}>
                <Link href="/issue">이슈 관리</Link>
              </li>
            </ol>
          </nav>
        </header>
        {children}
      </div>
    </>
  );
};

export default Layout;
