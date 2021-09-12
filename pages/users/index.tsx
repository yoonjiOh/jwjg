// import firebase from 'firebase/app';
import React, { useEffect } from 'react';
// import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
// import FirebaseAuth from '../../components/FirebaseAuth';
import LoginForm from './LoginForm';
// import { initializeApollo } from '../../apollo/apolloClient';
// import { GET_USERS } from '../../lib/queries';
// import { Users } from '@prisma/client';
// import { useRouter } from 'next/router';
// import Loading from '../../components/Loading';
// import { useQuery } from '@apollo/client';
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

// export const getServerSideProps = withAuthUserTokenSSR({})(async ({ AuthUser }) => {
//   const apolloClient = initializeApollo(null);
//   console.log('AuthUser', AuthUser);
//   console.log('AuthUser.getIdToken()', AuthUser.getIdToken());
//   if (AuthUser.id) {
//     const {
//       data: { userByFirebase: userData },
//     }: { data: { userByFirebase: Users } } = await apolloClient.query({
//       query: GET_USERS,
//       variables: { firebaseUID: AuthUser.id },
//     });

//     return {
//       // redirect: {
//       // destination: '/users/terms_of_service',
//       // },
//       props: {
//         createInternalAccount: true,
//       },
//     };
//   }
//   return {};
//   // const apolloClient = initializeApollo(null);
//   // const {
//   //   data: { userByFirebase: userData },
//   // }: { data: { userByFirebase: Users } } = await apolloClient.query({
//   //   query: GET_USERS,
//   //   variables: { firebaseUID: AuthUser.id },
//   // });

//   // if (!userData) {
//   //   return {
//   //     // redirect: {
//   //     // destination: '/users/terms_of_service',
//   //     // },
//   //     props: {
//   //       createInternalAccount: true,
//   //     },
//   //   };
//   // }
//   // console.log('userData', userData);
// });

export const getServerSideProps = async context => {
  const session = await getSession(context);

  console.log('session in user index.tsx', session);

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
  // const AuthUser = useAuthUser();
  const [session] = useSession();

  console.log('session:', session);

  if (!session) {
    return <LoginForm />;
  }

  // const { data } = useQuery(GET_USERS, {
  //   variables: { firebaseUID: session.user.id },
  //   skip: !session.user.id,
  // });

  // console.log(session.user);
  // console.log(data);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (session.user.id && !data) {
  //       console.log('ddd');
  //       router.push('/users/terms_of_service');
  //     }
  //   }, 3000);
  // }, [session.user, data, router]);

  // // // const session.user = usesession.user();
  // if (session.user.id && !data) {
  //   return <Loading />;
  // }
  // //   return <Loading />;
  // //   //   router.push('/users/terms_of_service');
  // // }

  // return <LoginForm />;
};

// export default withAuthUser({ whenUnauthedBeforeInit: AuthAction.SHOW_LOADER })(Auth);
export default Auth;
