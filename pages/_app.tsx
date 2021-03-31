import '../styles/globals.css';
import initAuth from '../utils/initAuth' // the module you created above

initAuth()

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
