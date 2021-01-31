import styles from '../styles/Home.module.css'
import { withApollo } from "../apollo/client";
import Header from '../components/Header';

const Home = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
          <a href="/issue_list">이슈 페이지 리스트</a>
      </main>

      <footer className={styles.footer}>
          Powered by 좌우지간
      </footer>
    </div>
  )
};


export default withApollo(Home);
