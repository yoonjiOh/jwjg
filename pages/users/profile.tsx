import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';

function Profile() {
  const user = useAuthUser();

  return (
    <Layout title={'Profile'} headerInfo={{ headerType: 'editMode', subTitle: '프로필 편집' }}>
      <main className={common_style.main}>
        <div>my email: {user.email}</div>
      </main>
    </Layout>
  );
}

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile)