import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { User } from 'next-auth';
import { getSession } from 'next-auth/client';

export interface GetServerSidePropsContextWithUser extends GetServerSidePropsContext {
  user: User;
}

export function requireAuthenticationWhileSignUp(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContextWithUser) => {
    const session = await getSession(ctx);
    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/users',
          permanent: false,
        },
      };
    }
    ctx.user = session.user;
    return await gssp(ctx);
  };
}

export function requireAuthentication(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContextWithUser) => {
    const session = await getSession(ctx);
    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/users',
          permanent: false,
        },
      };
    }
    if (!session.user.consentToSAt) {
      return {
        redirect: {
          destination: '/users/terms_of_service',
          permanent: false,
        },
      };
    }
    ctx.user = session.user;
    return await gssp(ctx);
  };
}

export function requireAdmin(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContextWithUser) => {
    const session = await getSession(ctx);
    if (!session || !session.user || !session.user.isAdmin) {
      return {
        redirect: {
          destination: '/users',
          permanent: false,
        },
      };
    }
    if (!session.user.consentToSAt) {
      return {
        redirect: {
          destination: '/users/terms_of_service',
          permanent: false,
        },
      };
    }
    ctx.user = session.user;
    return await gssp(ctx);
  };
}
