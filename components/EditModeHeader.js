import s from './Layout.module.css';
import { useRouter } from 'next/router';

const EditModeHeader = ({ subTitle, action, isDimmed }) => {
  const router = useRouter();

  return (
    <header className={isDimmed ? s.header + ' loading-transparent-overlay' : s.header}>
      <span className={s.goBack} onClick={() => router.back()}>
        <img
          src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/go_back_btn.svg"
          alt="뒤로가기 버튼"
          className={s.headerGoBackBtn}
        />
      </span>
      <span className={s.subTitle}>{subTitle}</span>
      <span className={s.actionBtn}>{action}</span>
    </header>
  );
};

export default EditModeHeader;
