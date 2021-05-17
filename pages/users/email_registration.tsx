import React, { useState } from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import { doEmailSignup } from './lib/users';

function EmailRegistration() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const handleEmailChange = event => setEmail(event.target.value);
  const handlePasswordChange = event => setPwd(event.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    doEmailSignup(email, pwd);
  };

  return (
    <Layout headerInfo={{ headerType: 'editMode' }}>
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
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(EmailRegistration);
