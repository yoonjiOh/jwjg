import '../styles/globals.scss';
import initAuth from '../utils/initAuth'; // the module you created above
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/apolloClient';
import type { AppProps } from 'next/app';

initAuth();
// import { ProvideAuth } from './users/lib/users';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      {/* <ProvideAuth> */}
        <Component {...pageProps} />
      {/* </ProvideAuth> */}
    </ApolloProvider>
  );
}

export default MyApp;
