import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import s from './index.module.scss';
import style from '../issues/[issueId].module.scss';
import { GET_STANCES_BY_ISSUE } from '../../lib/graph_queries';

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
      userId
      issuesId
      stancesId
    }
  }
`;

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo(null);
    const { data } = await apolloClient.query({
      query: GET_STANCES_BY_ISSUE,
      variables: { issuesId: +context.query.issueId },
    });

    const { data: opinionData } = await apolloClient.query({
      query: GET_MY_OPINION,
      variables: {
        userId: context.user.id,
        issuesId: +context.query.issueId,
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
      window.alert('????????? ????????? ?????????.');
      return;
    }
    let newOpinionId;
    try {
      if (myOpinion) {
        await updateOpinion({
          variables: {
            id: +myOpinion.id,
            content: opinionBody,
            stancesId: +stancesId,
          },
        });
      } else {
        const newOpinion = await createOpinion({
          variables: {
            content: opinionBody,
            userId: props.user.id,
            issuesId: +issueId,
            stancesId: +stancesId,
          },
        });

        newOpinionId = newOpinion.data.createOpinion.id;
      }

      router.push({
        pathname: `/issues/${issueId}/opinions/${myOpinion ? myOpinion.id : newOpinionId}`,
      });
    } catch (e) {
      window.alert('?????? ????????? ?????????????????????. ?????? ????????? ?????????');
    }
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '?????? ??????',
    action: (
      <button
        className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
        onClick={handleRegisterOpinion}
      >
        ??????
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
              <div className={s.stanceNoti}>????????? ?????? ??????, ????????? ?????? ????????? ??????????????????!</div>
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
                ????????? ???????????????.
              </div>
              <div className="stancesWrapper">
                <textarea
                  className={s.opinionInput}
                  placeholder="????????? ?????? ????????? ???????????? ?????? ?????????."
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
