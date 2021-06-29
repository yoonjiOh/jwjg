import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import { useState } from 'react';
import common_style from '../index.module.scss';
import u_style from './users.module.scss';
import { useRouter } from 'next/router';

const headerTitle = '약관 동의';

function TermsOfService() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    router.push('/users/additional_information');
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: headerTitle,
    action: (
      <button
        className={`${u_style.headerBtn} ${!agreed && u_style.disabled}`}
        disabled={!agreed}
        onClick={handleSubmit}
      >
        다음
      </button>
    ),
  };

  const handleChange = () => {
    // if (event.target.checked) {
    //   console.log(['show temrs_of_service documentation']);
    // }

    setAgreed(prevState => {
      return !prevState;
    });
  };

  return (
    <Layout title={headerTitle} headerInfo={headerInfo}>
      <main className={common_style.main}>
        <div className={u_style.wrapper}>
          <div className={u_style.bigHeader}>약관에 동의해 주세요</div>
          <div className={u_style.agreeBread}>
            <label>
              <img
                src={
                  agreed
                    ? 'https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/ico_check_circle.png'
                    : 'https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/ico_check_circle--disable.png'
                }
              />
              <input style={{ visibility: 'hidden' }} type="checkbox" onChange={handleChange} />
              <span className={agreed && u_style.agreed}>이용 약관에 동의해요</span>
            </label>
            <a
              target="_blank"
              href="https://docs.google.com/document/d/1ezGQ7FzFbWPPsnzZjmZLWVFA0hI5N75wP0R1LQ17Dgg/edit?usp=sharing"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              더 보기
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(TermsOfService);
