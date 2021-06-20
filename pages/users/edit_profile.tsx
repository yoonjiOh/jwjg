import React, { useState } from 'react';

import Layout from '../../components/Layout';
import { Prisma, Users } from '@prisma/client';
import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import _ from 'lodash';

const GET_USERS = gql`
  query($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
      firebaseUID
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

export const UPDATE_PROFILE = gql`
  mutation updateUserProfile(
    $id: Int!
    $name: String
    $nickname: String
    $intro: String
    $profileImageUrl: String
  ) {
    updateUserProfile(
      id: $id
      name: $name
      nickname: $nickname
      intro: $intro
      profileImageUrl: $profileImageUrl
    ) {
      id
      name
      nickname
      intro
      profileImageUrl
    }
  }
`;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo(null);
  const { data } = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });

  console.log(data);

  return {
    props: {
      user: data.userByFirebase,
    },
  };
});

interface Props {
  user: Users;
}

const EditProfile = (props: Props) => {
  const initState = {
    name: props.user.name,
    nickname: props.user.nickname,
    intro: props.user.intro,
    profileImageUrl: props.user.profileImageUrl,
  };
  const [state, setState] = useState(initState);
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);
  const [updateUserProfile, { data }] = useMutation(UPDATE_PROFILE);

  const { name, nickname, intro, profileImageUrl } = state;
  const router = useRouter();
  const { isFirst } = router.query;

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

  const handleSubmit = async event => {
    event.preventDefault();
    await updateUserProfile({
      variables: {
        id: parseInt(props.data.user.id),
        name: name,
        nickname: nickname,
        intro: intro,
        profileImageUrl: profileImageUrl,
      },
    }).then(result => {
      if (result.data) {
        router.push(`/users/mypage?userId=${props.data.user.id}`);
      } else {
        console.error('프로필 편집에 문제가 생겼습니다.');
      }
    });
  };

  const handleChange = (e, key) => {
    console.log('handleChange', e.target);
    setState(prevState => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: isFirst ? '프로필 만들기' : '프로필 편집',
    action: (
      <button
        style={{
          background: 'none',
          color: '#4494ff',
          fontWeight: 'bolder',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleSubmit}
      >
        완료
      </button>
    ),
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

          <label style={{ color: '#4494ff', textAlign: 'center', display: 'block' }}>
            <input type="file" required onChange={handleFileChange} />
            프로필 사진 바꾸기
          </label>

          <form onSubmit={handleSubmit} className={s.profileFormWrapper}>
            <span className={s.inputTitle}>이름</span>
            <input
              type="text"
              value={name}
              onChange={e => handleChange(e, 'name')}
              placeholder="이름"
              className={s.inputForm}
            />
            <span className={s.inputTitle}>사용자 이름</span>
            <input
              type="text"
              value={nickname}
              onChange={e => handleChange(e, 'nickname')}
              placeholder="사용자 이름"
              className={s.inputForm}
            />
            <span className={s.inputTitle}>소개</span>
            <input
              type="text"
              value={intro}
              onChange={e => handleChange(e, 'intro')}
              placeholder="소개"
              className={s.inputForm}
            />
          </form>
        </div>
      </main>
    </Layout>
  );
};

// TODO: add login required.
export default EditProfile;
