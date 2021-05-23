import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import { doEmailSignup } from './lib/users.ts';

function EmailRegistration() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const router = useRouter();

  const handleEmailChange = event => setEmail(event.target.value);
  const handlePasswordChange = event => setPwd(event.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    const ret = await doEmailSignup(email, pwd);
    console.log('succeeded!:' + ret);
    if (ret == true) {
      router.push('/users/additional_information');
    }
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '회원가입',
    action: (
      <button
      // className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
      // onClick={handleRegisterOpinion}
      >
        다음
      </button>
    ),
  };

  return (
    <Layout title={'registration'} headerInfo={headerInfo}>
      <form onSubmit={handleSubmit}>
        <label>
          email
          <input
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일 주소"
          />
        </label>
        <br />
        <label>
          passowrd
          <input
            name="email"
            type="password"
            value={pwd}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(EmailRegistration);
