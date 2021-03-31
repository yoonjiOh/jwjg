import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>
      <h1>Login Page</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  );
}
