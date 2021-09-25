import React, { useEffect, useState } from 'react';

import Layout from '../../components/Layout';
import s from './users.module.scss';
import { useRouter } from 'next/router';

import { gql, useMutation } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import _ from 'lodash';
import { empty_string_if_null } from '../../utils/string_utils';
import { GET_USERS, SINGLE_UPLOAD_IMG } from '../../lib/graph_queries';
import { getSession, useSession } from 'next-auth/client';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { UPDATE_USER_INFO } from '../../lib/graph_queries';
import { User } from 'next-auth';

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

const EditProfile = (props: Props) => {
  console.log(props);
  const initState = {
    name: props.user.name,
    nickname: empty_string_if_null(props.user.nickname),
    intro: empty_string_if_null(props.user.intro),
    image: empty_string_if_null(props.user.image),
  };
  const [state, setState] = useState(initState);
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);
  const [updateUserInfo, { data }] = useMutation(UPDATE_USER_INFO);
  const router = useRouter();

  const { name, nickname, intro, image } = state;

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
            return { ...prevState, image: uploadedS3Url };
          });
        }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    await updateUserInfo({
      variables: {
        id: props.user.id,
        name: name,
        nickname: nickname,
        intro: intro,
        image: image,
      },
    })
      .then(result => {
        console.log(result);
        if (result.data) {
          console.log('jhere');
          // @ts-ignore
          // router.push('/');
          router.push(isFirst ? '/users/user_info' : '/users/mypage');
        } else {
          console.error('프로필 편집에 문제가 생겼습니다.');
        }
      })
      .catch(error => {
        console.error(JSON.stringify(error, null, 2));
      });
  };

  const handleChange = (e, key) => {
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
    <Layout
      title={isFirst ? '프로필 만들기' : '프로필 편집'}
      headerInfo={headerInfo}
      isDimmed={false}
    >
      <main className={s.main} style={{ height: '100vh' }}>
        <div style={{ padding: '20px' }}>
          {!image ? (
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
              <img src={image} />
            </div>
          )}

          <label
            style={{ color: '#4494ff', textAlign: 'center', display: 'block', marginTop: '5px' }}
          >
            <input type="file" style={{ display: 'none' }} required onChange={handleFileChange} />
            {isFirst ? '프로필 사진 등록하기' : '프로필 사진 바꾸기'}
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
            <span className={s.inputTitle}>닉네임</span>
            <input
              type="text"
              value={nickname}
              onChange={e => handleChange(e, 'nickname')}
              placeholder="닉네임"
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

export default EditProfile;
