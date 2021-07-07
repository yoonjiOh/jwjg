import s from './users.module.scss';
import { useRouter } from 'next/router';

const welcomePage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>가입 완료, 반가워요!</h1>
      <div className={s.welcomeProfileWrapper}></div>

      <button
        className={s.primary}
        onClick={() => {
          router.push('/');
        }}
      >
        시작하기
      </button>
    </div>
  );
};

export default welcomePage;
