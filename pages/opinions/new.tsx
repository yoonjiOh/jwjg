import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import s from './index.module.scss';
import style from '../issues/[id].module.scss';
import { GET_USERS } from '../../lib/queries';

import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import _ from 'lodash';

const GET_STANCE = gql`
  query stances($id: Int!) {
    stances(id: $id) {
      id
      orderNum
      title
    }
  }
`;

const GET_STANCES_BY_ISSUE = gql`
  query stancesByIssueId($issuesId: Int!) {
    stancesByIssueId(issuesId: $issuesId) {
      id
      title
      orderNum
    }
  }
`;

const GET_MY_OPINION = gql`
  query myOpinion($usersId: Int, $issuesId: Int) {
    myOpinion(usersId: $usersId, issuesId: $issuesId) {
      id
      content
    }
  }
`;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/users',
})(async ({ AuthUser, query }) => {
  const apolloClient = initializeApollo(null);
  const meData = await apolloClient.query({
    query: GET_USERS,
    variables: { firebaseUID: AuthUser.id },
  });
  const userId = meData?.data?.userByFirebase?.id;

  const { issueId } = query;
  const { data } = await apolloClient.query({
    query: GET_STANCES_BY_ISSUE,
    variables: { issuesId: +issueId },
  });

  const { data: opinionData } = await apolloClient.query({
    query: GET_MY_OPINION,
    variables: {
      usersId: +userId,
      issuesId: +issueId,
    },
  });

  return {
    props: {
      stances: data,
      userId,
      myOpinion: opinionData.myOpinion,
    },
  };
});

const CREATE_OPINION = gql`
  mutation createOpinion($content: String!, $usersId: Int!, $issuesId: Int!, $stancesId: Int!) {
    createOpinion(
      content: $content
      usersId: $usersId
      issuesId: $issuesId
      stancesId: $stancesId
    ) {
      id
    }
  }
`;

const UPDATE_OPINION = gql`
  mutation updateOpinion($id: Int!, $content: String) {
    updateOpinion(id: $id, content: $content) {
      id
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($usersId: Int, $issuesId: Int, $stancesId: Int) {
    createUserStance(usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

const New = props => {
  const router = useRouter();
  const { issueId, stancesId } = router.query;
  const { userId, myOpinion } = props;

  const initState = myOpinion ? myOpinion.content : '';
  const [opinionBody, setOpinionBody] = useState(initState);
  const [createOpinion] = useMutation(CREATE_OPINION);
  const [updateOpinion] = useMutation(UPDATE_OPINION);
  const [createUserStance] = useMutation(CREATE_USER_STANCE);

  const hasStance = !!stancesId;

  const { data } = useQuery(GET_STANCE, { variables: { id: Number(stancesId) } });

  const stance = data && data.stances[0];

  const handleChange = e => {
    setOpinionBody(e.target.value);
  };

  const handleRegisterOpinion = async () => {
    try {
      if (myOpinion) {
        await updateOpinion({
          variables: {
            id: myOpinion.id,
            content: opinionBody,
          },
        });
      } else {
        await createOpinion({
          variables: {
            content: opinionBody,
            usersId: Number(userId),
            issuesId: Number(issueId),
            stancesId: Number(stancesId),
          },
        });
      }

      router.push({
        pathname: `/issues`,
      });
    } catch (e) {
      window.alert('의견 등록에 실패하였습니다. 다시 시도해 주세요');
    }
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '의견 쓰기',
    action: (
      <button
        className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
        onClick={handleRegisterOpinion}
      >
        등록
      </button>
    ),
  };

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];
  const onStanceClick = async stancesId => {
    await createUserStance({
      variables: {
        usersId: Number(userId),
        issuesId: Number(issueId),
        stancesId,
      },
    }).then(result =>
      router.push({
        pathname: '/opinions/new',
        query: { issueId, stancesId },
      }),
    );
  };

  return (
    <>
      <Layout title={'New Opinion'} headerInfo={headerInfo}>
        <main className={s.main} style={{ background: '#fff' }}>
          {!hasStance ? (
            <div>
              <div className={s.stanceNoti}>의견을 쓰기 전에, 이슈에 대한 입장을 선택해주세요!</div>
              <div style={{ padding: '10px' }}>
                <ul className={style.stancePickItems}>
                  {props.stances.stancesByIssueId.map(stance => (
                    <li
                      className={style.stancePickItem}
                      key={stance.id}
                      onClick={() => onStanceClick(stance.id)}
                    >
                      {fruitsForStanceTitle[stance.orderNum]} {stance.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={s.opinionHasStanceWrapper}>
              <div className={s.stanceNoti}>
                {fruitsForStanceTitle[stance && stance.orderNum] + ' '}
                <span className={s.title}>{stance && stance.title}</span>
                입장을 표하셨어요.
              </div>
              <div className="stancesWrapper">
                <textarea
                  className={s.opinionInput}
                  placeholder="이슈에 대한 생각을 자유롭게 말해 주세요."
                  value={opinionBody}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

export default New;
