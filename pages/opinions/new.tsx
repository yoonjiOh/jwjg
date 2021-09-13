import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import s from './index.module.scss';
import style from '../issues/[issueId].module.scss';
import { GET_USERS, GET_STANCES_BY_ISSUE } from '../../lib/graph_queries';

import _ from 'lodash';
import { fruits } from '../../utils/getFruitForStanceTitle';
import { User } from 'next-auth';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';

const GET_STANCE = gql`
  query stances($id: Int!) {
    stances(id: $id) {
      id
      orderNum
      title
    }
  }
`;

const GET_MY_OPINION = gql`
  query myOpinion($userId: String, $issuesId: Int) {
    myOpinion(userId: $userId, issuesId: $issuesId) {
      id
      content
    }
  }
`;

const CREATE_OPINION = gql`
  mutation createOpinion($content: String!, $userId: String!, $issuesId: Int!, $stancesId: Int!) {
    createOpinion(content: $content, userId: $userId, issuesId: $issuesId, stancesId: $stancesId) {
      id
    }
  }
`;

const UPDATE_OPINION = gql`
  mutation updateOpinion($id: Int!, $content: String, $stancesId: Int) {
    updateOpinion(id: $id, content: $content, stancesId: $stancesId) {
      id
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($userId: String, $issuesId: Int, $stancesId: Int) {
    createUserStance(userId: $userId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
//   authPageURL: '/users',
// })(async ({ AuthUser, query }) => {
//   const apolloClient = initializeApollo(null);
//   const meData = await apolloClient.query({
//     query: GET_USERS,
//     variables: { firebaseUID: AuthUser.id },
//   });
//   const userId = meData?.data?.userByFirebase?.id;

//   const { issueId } = query;
//   const { data } = await apolloClient.query({
//     query: GET_STANCES_BY_ISSUE,
//     variables: { issuesId: +issueId },
//   });

//   const { data: opinionData } = await apolloClient.query({
//     query: GET_MY_OPINION,
//     variables: {
//       userId: +userId,
//       issuesId: +issueId,
//     },
//   });

//   return {
//     props: {
//       stances: data,
//       userId,
//       myOpinion: opinionData.myOpinion,
//     },
//   };
// });

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_STANCES_BY_ISSUE,
      variables: { issuesId: context.query.issueId },
    });
    const { data: opinionData } = await apolloClient.query({
      query: GET_MY_OPINION,
      variables: {
        userId: context.user.id,
        issuesId: context.query.issueId,
      },
    });

    return {
      props: {
        user: context.user,
        stances: data,
        myOpinion: opinionData.myOpinion,
      },
    };
  },
);

interface Props {
  user: User;
  stances: any;
  myOpinion: any;
}

const New = (props: Props) => {
  const router = useRouter();
  const { issueId, stancesId } = router.query;
  const { myOpinion } = props;

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
    if (!opinionBody) {
      window.alert('내용을 작성해 주세요.');
      return;
    }
    let newOpinionId;
    try {
      if (myOpinion) {
        const result = await updateOpinion({
          variables: {
            id: myOpinion.id,
            content: opinionBody,
            stancesId: Number(stancesId),
          },
        });
      } else {
        const newOpinion = await createOpinion({
          variables: {
            content: opinionBody,
            userId: props.user.id,
            issuesId: Number(issueId),
            stancesId: Number(stancesId),
          },
        });

        newOpinionId = newOpinion.data.createOpinion.id;
      }

      const path = `/issues/${issueId}/opinions/${myOpinion ? myOpinion.id : newOpinionId}`;
      router.push({
        pathname: path,
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

  const onStanceClick = async stancesId => {
    await createUserStance({
      variables: {
        userId: props.user.id,
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
      <Layout title={'New Opinion'} headerInfo={headerInfo} isDimmed={false}>
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
                      {fruits[stance.orderNum]} {stance.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={s.opinionHasStanceWrapper}>
              <div className={s.stanceNoti}>
                {fruits[stance && stance.orderNum] + ' '}
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
