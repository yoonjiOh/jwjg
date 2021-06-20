import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { Users } from '@prisma/client';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';
import { GET_USERS } from './queries';

import { UPDATE_PROFILE } from './edit_profile';
import { useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

// export default withAuthUser({
//   whenAuthed: AuthAction.RENDER,
//   whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(AdditionalInformation);

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });

  return {
    props: {
      user: data.userByFirebase,
    },
  };
});

interface Props {
  user: Users;
}

const AdditionalInformation = (props: Props) => {
  const router = useRouter();
  const [name, setName] = useState('@');

  const [updateUserProfile] = useMutation(UPDATE_PROFILE);

  const handleNameChange = event => {
    setName('@' + event.target.value.substr(1));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // handle user info update mutation using useMutation hook.
    await updateUserProfile({
      variables: {
        id: props.user.id,
        name: name.substr(1),
      },
    })
      .then(result => {
        console.log(result);
      })
      .finally(() => {
        router.push({
          pathname: '/users/edit_profile',
          query: { isFirst: true },
        });
      });
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '회원가입',
    action: (
      <button
        // className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
        onClick={handleSubmit}
      >
        완료
      </button>
    ),
  };

  return (
    <Layout title={'유저 상세 정보 입력'} headerInfo={headerInfo}>
      <main className={common_style.main}>
        <span>사용자 이름을 정해 주세요</span>
        <form onSubmit={handleSubmit}>
          <label>
            사용자 이름
            <input name="name" value={name} onChange={handleNameChange} />
          </label>
          <br />
        </form>
      </main>
    </Layout>
  );
}

export default AdditionalInformation;
