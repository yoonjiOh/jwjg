import React, { useEffect } from 'react';
import LoginForm from './LoginForm';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const styles = {
  content: {
    padding: `8px 32px`,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 16,
  },
};

export const getServerSideProps = async context => {
  const session = await getSession(context);
  if (session) {
    if (session.user.consentToSAt) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: '/users/terms_of_service',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

const Auth = props => {
  return <LoginForm />;
};

export default Auth;
