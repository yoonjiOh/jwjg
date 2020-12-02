import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Repol project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          이슈 페이지 데모
        </h1>

        <p className={styles.description}>
          이슈 페이지 데모 입니다.
          {/* <code className={styles.code}>pages/index.js</code> */}
        </p>

        {/* <div className={styles.grid}>
          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
          Powered by 좌우지간
      </footer>
    </div>
  )
}
