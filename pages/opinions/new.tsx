import React, { useState } from 'react';
import { withApollo } from '../../apollo/client';
import { gql, useMutation, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import config from '../../config';


import s from './index.module.scss';


const GET_STANCE = gql`
  query stances($id: Int!) {
    stances(id: $id) {
      id
      title
    }
  }
`;

const CREATE_OPINION = gql`
  mutation createOpinion($content: String!, $usersId: Int!, $issuesId: Int!, $stancesId: Int!) {
    createOpinion(content: $content, usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      id
    }
  }
`;

const New = () => {
  const [opinionBody, setOpinionBody] = useState('');
  const [createOpinion] = useMutation(CREATE_OPINION);

  const router = useRouter();
  const { userId, issueId, stancesId } = router.query;
  const hasStance = !!stancesId;

  const { data } = useQuery(GET_STANCE, { variables: { id: Number(stancesId) } });
  const stanceTitle = data && data.stances[0].title;

  const handleChange = (e) => {
    setOpinionBody(e.target.value)
  }

  const handleRegisterOpinion = async () => {
    try {
      await createOpinion({
        variables: {
          content: opinionBody,
          usersId: Number(userId),
          issuesId: Number(issueId),
          stancesId: Number(stancesId),
        }
      }).then(result => {
        if (result.data.createOpinion.id) {
          if (
            window.confirm('의견이 등록되었습니다. 이전 이슈로 돌아가시겠습니까?')
          ) {
            window.location.href = `${config.host}/${issueId}`;
          } else {
            window.location.href = `${config.host}`;
          }
        }
      })
    } catch (e) {
      console.error(e);
    }
  }

  const headerInfo = {
    headerType: 'editMode',
    subTitle: '의견 쓰기',
    action: <button className={`${s.registerOpinionBtn} ${!opinionBody.length && s.disabled}`}
      onClick={handleRegisterOpinion}
    >등록</button>,
  }

  return (
    <>
      <Layout title={"New Opinion"}
        headerInfo={headerInfo}
      >
        <main className={s.main}>
          {!hasStance ?
            <div>
              <div className={s.stanceNoti}>의견을 쓰기 전에, 이슈에 대한 입장을 선택해주세요!</div>
              <div className="stancesWrapper">

              </div>
            </div> :
            <div>
              <div className={s.stanceNoti}>{stanceTitle} 입장을 표하셨어요.</div>
              <div className="stancesWrapper">
                <textarea
                  className={s.opinionInput}
                  placeholder="이슈에 대한 생각을 자유롭게 말해 주세요."
                  value={opinionBody}
                  onChange={handleChange} />
              </div>
            </div>
          }
        </main>
      </Layout>
    </>
  );
};

export default withApollo(New);
