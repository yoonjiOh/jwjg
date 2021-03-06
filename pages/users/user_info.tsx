import s from './users.module.scss';
import React, { useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CREATE_USER_INFO } from '../../lib/graph_queries';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { User } from 'next-auth';

const ageChoices = [10, 20, 30, 40, 50, 60];
const genderChoices = ['남성', '여성', '그 외'];
const residenceChoices = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '경기',
  '강원',
  '충북',
  '충남',
  '경북',
  '경남',
  '전북',
  '전남',
  '제주',
];

const GET_USER = gql`
  query userByFirebase($firebaseUID: String) {
    userByFirebase(firebaseUID: $firebaseUID) {
      id
    }
  }
`;

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

const UserInfo = (props: Props) => {
  const [choiceObj, setChoiceObj] = useState({ age: null, gender: null, residence: null });
  const [createUserInfo] = useMutation(CREATE_USER_INFO);
  const user = props.user;

  const router = useRouter();

  const handleSelectChoice = (type, value) => {
    setChoiceObj(prevState => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const handleSubmitUserInfo = async () => {
    const { age, gender, residence } = choiceObj;
    if (!user.id) {
      alert('유저 아이디가 없어요');
      return;
    }
    try {
      await createUserInfo({
        variables: {
          userId: user.id,
          age,
          gender,
          residence,
        },
      }).then(() => {
        router.push('/users/welcome');
      });
    } catch (e) {
      console.error('There is a problem in creating user info', JSON.stringify(e, null, 2));
    }
  };

  return (
    <div className={s.container}>
      <main style={{ marginTop: '0', height: '100vh' }}>
        <div className={s.userInfoWrapper}>
          <div className={s.userInfoWrapper} style={{ padding: '20px 20px 30px' }}>
            <h1>당신이 궁금해요</h1>
            <p>저희는 이제 시작하는 단계랍니다.</p>
            <p>그래서 당신이 어떤 사람인지 알고 싶어요.</p>
            <p>당신과 더 잘 맞는 좌우지간이 되기 위해 노력할게요! 😊</p>
          </div>

          <div className={s.selectorWrapper}>
            <div className={s.selectorTitle}>연령대</div>
            <div className={s.choicesWrapper}>
              {ageChoices.map(age => (
                <div
                  key={age}
                  className={`${s.choice} ${choiceObj.age === age && s.selected}`}
                  style={{ width: age < 60 ? '70px' : '100px' }}
                  onClick={() => handleSelectChoice('age', age)}
                >
                  {age < 60 ? `${age}대` : `${age}대 이상`}
                </div>
              ))}
            </div>

            <div className={s.selectorTitle}>성별</div>
            <div className={s.choicesWrapper}>
              {genderChoices.map(gender => (
                <div
                  key={gender}
                  className={`${s.choice} ${choiceObj.gender === gender && s.selected}`}
                  onClick={() => handleSelectChoice('gender', gender)}
                >
                  {gender}
                </div>
              ))}
            </div>

            <div className={s.selectorTitle}>거주 지역</div>
            <div className={s.choicesWrapper}>
              {residenceChoices.map(residence => (
                <div
                  key={residence}
                  className={`${s.choice} ${choiceObj.residence === residence && s.selected}`}
                  onClick={() => handleSelectChoice('residence', residence)}
                >
                  {residence}
                </div>
              ))}
              <div style={{ height: '80px', width: '100%' }}></div>
            </div>
          </div>

          <div className={s.buttonsWrapper}>
            <button className={s.primary} onClick={handleSubmitUserInfo}>
              등록하기
            </button>
            <button
              className={s.default}
              onClick={() => {
                router.push('/users/welcome');
              }}
            >
              건너뛰기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserInfo;
