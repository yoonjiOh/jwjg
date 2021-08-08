import firebase from 'firebase/app';
import React, { useEffect } from 'react';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import FirebaseAuth from '../../components/FirebaseAuth';
import LoginForm from './LoginForm';
import { initializeApollo } from '../../apollo/apolloClient';
import { GET_USERS } from '../../lib/queries';
import { Users } from '@prisma/client';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import { useQuery } from '@apollo/client';

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

const Auth = props => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  const { data } = useQuery(GET_USERS, {
    variables: { firebaseUID: AuthUser.id },
    skip: !AuthUser.id,
  });

  console.log(AuthUser);
  console.log(data);

  useEffect(() => {
    if (AuthUser.id && !data) {
      router.push('/users/terms_of_service');
    }
  }, [AuthUser, data, router]);

  // // const AuthUser = useAuthUser();
  if (AuthUser.id && !data) {
    return <Loading />;
  }
  //   return <Loading />;
  //   //   router.push('/users/terms_of_service');
  // }

  return <LoginForm />;
};

export default withAuthUser({ whenUnauthedBeforeInit: AuthAction.SHOW_LOADER })(Auth);
