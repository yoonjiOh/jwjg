import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
// @ts-ignore
import FormControlLabel from '@material-ui/core/FormControlLabel';
// @ts-ignore
import Checkbox from '@material-ui/core/Checkbox';
// @ts-ignore
import Link from '@material-ui/core/Link';
import { useState } from 'react';
import common_style from '../index.module.scss';
import { useRouter } from 'next/router';

const headerTitle = '약관 동의';

function TermsOfService() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    // TODO: mark db that user acceepted ToS.
    router.push('/users/additional_information');
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: headerTitle,
    action: (
      <button disabled={!agreed} onClick={handleSubmit}>
        다음
      </button>
    ),
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.checked) {
    //   console.log(['show temrs_of_service documentation']);
    // }
    setAgreed(event.target.checked);
  };

  return (
    <Layout title={headerTitle} headerInfo={headerInfo}>
      <main className={common_style.main}>
        <div>약관에 동의해 주세요</div>
        <FormControlLabel
          control={<Checkbox checked={agreed} onChange={handleChange} color="primary" />}
          label="이용 약관에 동의해요"
        />
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            // Move to 약관내용 페이지
          }}
        >
          더 보기
        </Link>
        {/* <form onSubmit={handleSubmit}>
          <label>
            사용자 이름
            <input name="name" value={name} onChange={handleNameChange} placeholder="@" />
          </label>
          <br />
        </form> */}
      </main>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(TermsOfService);
