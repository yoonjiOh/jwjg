import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/client';

export interface GetServerSidePropsContextWithUser extends GetServerSidePropsContext {
  user: any;
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
    ctx.user = session.user;
    return await gssp(ctx);
  };
}
