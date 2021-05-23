import React, { useState } from 'react';

import Layout from '../../components/Layout';
import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';

const MyOpinions = () => {
  const headerInfo = {
    headerType: 'editMode',
    subTitle: '작성한 의견',
  };

  return (
    <Layout title={'작성한 의견'} headerInfo={headerInfo}>
      <main className={s.main}></main>
    </Layout>
  );
};

export default MyOpinions;
