import { User } from 'next-auth';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    return {
      props: {
        user: context.user,
      },
    };
  },
);

interface Props {
  user: User;
}

const Profile = (props: Props) => {
  return (
    <Layout
      title={'Profile'}
      headerInfo={{ headerType: 'editMode', subTitle: '프로필 편집' }}
      isDimmed={false}
    >
      <main className={common_style.main}>
        <div>my email: {props.user.email}</div>
      </main>
    </Layout>
  );
};

export default Profile;
