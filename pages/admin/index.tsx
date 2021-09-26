import React, { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/client';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';
import Link from 'next/link';

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

const headerTitle = 'admin page';

const AdminPage = props => {
  const headerInfo = {
    headerType: 'common',
  };

  return (
    <Layout title={headerTitle} headerInfo={headerInfo} isDimmed={false}>
      <main className={common_style.main}>
        <div>
          <Link href={`/admin/issues`}>
            <button className={common_style.actionBtn}>이슈관리</button>
          </Link>
        </div>
        <div>
          <Link href={`/admin/users`}>
            <button className={common_style.actionBtn}>유저관리</button>
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export default AdminPage;
