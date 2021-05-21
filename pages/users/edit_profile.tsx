import React, { useState } from 'react';

import Layout from '../../components/Layout';
import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';

const GET_USER = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      name
      intro
      profileImageUrl
    }
  }
`;

const SINGLE_UPLOAD_IMG = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { id } = context.query;

  const { data } = await apolloClient.query({
    query: GET_USER,
    variables: { id: parseInt(id) },
  });

  return {
    props: {
      data: data,
    },
  };
};

const EditProfile = props => {
  const initState = {
    name: props.data.user.name,
    intro: props.data.user.intro,
    profileImageUrl: props.data.user.profileImageUrl,
  };
  const [state, setState] = useState(initState);
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);
  // Todo: 이미지 업로드 버그 수정

  const { name, intro, profileImageUrl } = state;

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '프로필 편집',
    action: (
      <button
      // className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
      // onClick={handleRegisterOpinion}
      >
        완료
      </button>
    ),
  };

  const handleFileChange = async ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    let uploadedS3Url;
    validity.valid &&
      (await mutate({
        variables: { file },
      })
        .then(result => {
          uploadedS3Url = result.data.singleUpload.url;
        })
        .then(() => {
          setState(prevState => {
            return { ...prevState, profileImageUrl: uploadedS3Url };
          });
        }));
  };

  return (
    <Layout title={'프로필 편집'} headerInfo={headerInfo}>
      <main className={s.main}>
        <div style={{ padding: '20px' }}>
          {!profileImageUrl ? (
            <div
              className={s.profileImgContainer}
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
              }}
            >
              <img
                src={'https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/add_btn_dark_gray.svg'}
                style={{ width: '50%', height: '50%' }}
              />
            </div>
          ) : (
            <div
              className={s.profileImgContainer}
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
              }}
            >
              <img src={profileImageUrl} style={{ width: '50%', height: '50%' }} />
            </div>
          )}
          {/* <p style={{ marginTop: '10px', textAlign: 'center', color: '#4494FF' }}>
            
          </p> */}
          <label>
            <input type="file" required onChange={handleFileChange} />
            프로필 사진 바꾸기
          </label>
          <div></div>
        </div>
      </main>
    </Layout>
  );
};

export default EditProfile;
