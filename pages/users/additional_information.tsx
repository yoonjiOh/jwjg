import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import { doEmailSignup } from './lib/users';

function AdditionalInformation() {
  const router = useRouter();
  const AuthUser = useAuthUser();
  const [intro, setIntro] = useState('');

  const handleIntroChange = event => setIntro(event.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    // handle user info update mutation using useMutation hook.
    router.push('/');
  };

  return (
    <Layout title={'유저 상세 정보 입력'} headerInfo={{ headerType: 'editMode' }}>
      <form onSubmit={handleSubmit}>
        <label>
          intro
          <input name="intro" value={intro} onChange={handleIntroChange} placeholder="내소개" />
        </label>
        <br />
        {/* <label>
          intro
          <input
            name="profile"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일 주소"
          />
        </label> */}
        <br />
        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AdditionalInformation);
