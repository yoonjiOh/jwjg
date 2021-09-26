import React, { useState } from 'react';
import { getSession, useSession } from 'next-auth/client';
import Layout from '../../../components/Layout';
import common_style from '../../index.module.scss';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../../lib/graph_queries';
import {
  GetServerSidePropsContextWithUser,
  requireAdmin,
} from '../../../lib/requireAuthentication';
import { initializeApollo } from '../../../apollo/apolloClient';
import { User } from 'next-auth';

const headerTitle = 'admin>user page';
const headerInfo = {
  headerType: 'common',
};

export const getServerSideProps = requireAdmin(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo(null);

    return {
      props: {
        user: context.user,
      },
    };
  },
);

interface Props {
  user: User;
}

const UserManage = (props: Props) => {
  const [state, setState] = useState({
    email: '',
    name: '',
    nickname: '',
  });
  const [createUser] = useMutation(CREATE_USER);

  const { email, name, nickname } = state;

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await createUser({
        variables: {
          email,
          name,
          nickname,
        },
      }).then(() => {
        alert('created user');
      });
    } catch (e) {
      console.error('There is a problem in creating user info', JSON.stringify(e, null, 2));
    }
  };

  const handleChange = (e, key) => {
    setState(prevState => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };

  return (
    <Layout title={headerTitle} headerInfo={headerInfo} isDimmed={false}>
      <main className={common_style.main}>
        <form onSubmit={handleSubmit}>
          <span>이메일</span>
          <input
            type="text"
            value={email}
            onChange={e => handleChange(e, 'email')}
            placeholder="이메일"
          />
          <br />
          <span>이름</span>
          <input
            type="text"
            value={name}
            onChange={e => handleChange(e, 'name')}
            placeholder="이름"
          />
          <br />
          <span>닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={e => handleChange(e, 'nickname')}
            placeholder="닉네임"
          />
          <br />
          <input type="submit" value="유저생성" />
        </form>
      </main>
    </Layout>
  );
};

export default UserManage;
