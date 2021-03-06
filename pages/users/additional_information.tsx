import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';
import u_style from './users.module.scss';
import { GET_USERS } from '../../lib/graph_queries';

import { useMutation } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import { getSession } from 'next-auth/client';
import { User } from '.prisma/client';
import { UPDATE_USER_INFO } from '../../lib/graph_queries';

export interface SerializedAuthUser {
  id: string;
  email: string;
}

export const getServerSideProps = async context => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/users',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: session.user,
    },
  };
};

interface Props {
  user: User;
}

const AdditionalInformation = (props: Props) => {
  const router = useRouter();
  const [nickname, setNickname] = useState('@');

  const [updateUserInfo] = useMutation(UPDATE_USER_INFO);

  const handleNicknameChange = event => {
    setNickname('@' + event.target.value.substr(1));
  };

  const handleDeleteInput = () => {
    setNickname('@');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // handle user info update mutation using useMutation hook.
    await updateUserInfo({
      variables: {
        id: props.user.id,
        name: nickname.substr(1),
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
        className={`${u_style.headerBtn} ${nickname.length === 1 && u_style.disabled}`}
        disabled={nickname.length === 1}
        onClick={handleSubmit}
      >
        완료
      </button>
    ),
  };

  return (
    <Layout title={'유저 상세 정보 입력'} headerInfo={headerInfo} isDimmed={false}>
      <main className={common_style.main}>
        <div className={u_style.wrapper}>
          <div className={u_style.bigHeader}>닉네임을 정해 주세요</div>
          <form className={u_style.formWrapper} onSubmit={handleSubmit}>
            <label className={u_style.label}>
              닉네임
              <div className={u_style.inputWrapper}>
                <input
                  className={u_style.inputForm}
                  name="nickname"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/ico_x.png"
                  onClick={handleDeleteInput}
                />
              </div>
            </label>
            <br />
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default AdditionalInformation;
