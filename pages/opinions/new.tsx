import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';

import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import config from '../../config';
import s from './index.module.scss';
import style from '../issues/[id].module.scss';
import _ from 'lodash';
import { route } from 'next/dist/next-server/server/router';

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

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { issueId } = context.query;
  const { data } = await apolloClient.query({
    query: GET_STANCES_BY_ISSUE,
    variables: { issuesId: Number(issueId) },
  });

  return {
    props: {
      stances: data,
    },
  };
};

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
  const [opinionBody, setOpinionBody] = useState('');
  const [createOpinion] = useMutation(CREATE_OPINION);
  const [createUserStance] = useMutation(CREATE_USER_STANCE);

  const router = useRouter();
  const { userId, issueId, stancesId } = router.query;
  const hasStance = !!stancesId;

  const { data } = useQuery(GET_STANCE, { variables: { id: Number(stancesId) } });

  const stance = data && data.stances[0];

  const handleChange = e => {
    setOpinionBody(e.target.value);
  };

  const handleRegisterOpinion = async () => {
    try {
      await createOpinion({
        variables: {
          content: opinionBody,
          usersId: Number(userId),
          issuesId: Number(issueId),
          stancesId: Number(stancesId),
        },
      }).then(result => {
        if (result.data.createOpinion.id) {
          if (window.confirm('의견이 등록되었습니다. 이전 이슈로 돌아가시겠습니까?')) {
            window.location.href = `${config.host}/issues`;
          } else {
            window.location.href = `${config.host}`;
          }
        }
      });
    } catch (e) {
      console.error(e);
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
        query: { userId, issueId, stancesId },
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
            <div>
              <div className={s.stanceNoti}>
                {fruitsForStanceTitle[stance && stance.orderNum]} {stance && stance.title} 입장을
                표하셨어요.
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
