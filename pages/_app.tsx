import '../styles/globals.scss';
import initAuth from '../utils/initAuth'; // the module you created above

initAuth();
import { ProvideAuth } from './users/lib/users';

function MyApp({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <Component {...pageProps} />;
    </ProvideAuth>
  )
}

export default MyApp;
