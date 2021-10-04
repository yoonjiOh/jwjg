import Head from 'next/head';
import '../styles/globals.scss';
// import initAuth from '../utils/initAuth'; // the module you created above
import { Provider } from 'next-auth/client';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/apolloClient';
import type { AppProps } from 'next/app';

// initAuth();
// import { ProvideAuth } from './users/lib/users';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <>
      <Head>
        <title>좌우지간</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="/fav_152.png" />
        <link rel="icon" href="/fav_16.png" sizes="16x16" />
        <link rel="icon" href="/fav_32.png" sizes="32x32" />
        <link rel="icon" href="/fav_96.png" sizes="96x96" />
        <link rel="icon" href="/fav_152.png" sizes="152x152" />
        <link rel="icon" href="/fav_167.png" sizes="167x167" />
        <link rel="icon" href="/fav_180.png" sizes="180x180" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/img_meta.png"
        />
        <meta
          property="og:description"
          content="우리 이제 화해해요! 서로를 이해하는 이슈 SNS, 좌우지간"
        />
        <meta property="og:site_name" content="좌우지간" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <Provider session={pageProps.session}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
