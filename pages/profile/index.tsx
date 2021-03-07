import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { withApollo } from '../../apollo/client';
import Layout from '../../components/Layout';

const Profile = () => {
  return (
    <Layout title={'profile'}>
      <div>PROFILE</div>
    </Layout>
  );
};

export default withApollo(Profile);
