import React, { useReducer, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import Layout from '../../../components/Layout';
import config from '../../../config';
import style from './new.module.css';
import { initializeApollo } from '../../../apollo/apolloClient';
import { GET_STANCES_BY_ISSUE, SINGLE_UPLOAD_IMG } from '../../../lib/graph_queries';

interface Stance {
  title: String;
  orderNum: Number;
  id: Number;
}

const GET_ISSUE = gql`
  query issues($id: Int!) {
    issues(id: $id) {
      id
      title
      content
      imageUrl
    }
  }
`;

const UPDATE_ISSUE = gql`
  mutation updateIssue($id: Int!, $title: String!, $content: String!, $imageUrl: String!) {
    updateIssue(id: $id, title: $title, content: $content, imageUrl: $imageUrl) {
      id
      title
      content
      imageUrl
    }
  }
`;

const UPSERT_STANCE = gql`
  mutation upsertStance($id: Int!, $title: String, $orderNum: Int, $issuesId: Int) {
    upsertStance(id: $id, title: $title, orderNum: $orderNum, issuesId: $issuesId) {
      id
    }
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ISSUE':
      return {
        ...state,
        issue: action.data,
      };
    case 'FETCH_STANCES': {
      const newState = {
        ...state,
        stances: action.data,
      };

      return action.data?.reduce((acc, stance) => {
        return { ...acc, [`stance_${stance.id}`]: stance };
      }, newState)
    }
    case 'CHANGE_ISSUE_INPUT':
      const { key, value } = action.payload;
      return {
        ...state,
        issue: {
          ...state.issue,
          [key]: value,
        },
      };
    case 'SHOW_STANCE_INPUT':
      return {
        ...state,
        addStanceMode: true,
      };
    case 'INPUT_NEW_STANCE_TITLE':
      return {
        ...state,
        newStance: action.value,
      };
    case 'ADD_STANCE': {
      const { id, orderNum, title } = action.value
      console.log('ADD_STANCE', action.value)
      return {
        ...state,
        stances: state.stances.concat(action.value),
        [`stance_${id}`]: {
          id,
          orderNum,
          title
        },
        addStanceMode: false,
      };
    }
    case 'UPDATE_ISSUE_STANCES': {
      const { value: title, id, orderNum } = action.payload;

      return {
        ...state,
        [`stance_${id}`]: {
          id,
          orderNum,
          title
        },
      };
    }
    case 'SET_IMAGE_URL':
      return {
        ...state,
        issue: {
          ...state.issue,
          imageUrl: action.value,
        },
      };
    default:
      return;
  }
};

export const getServerSideProps = async context => {
  const apolloClient = initializeApollo(null);
  const { id: issueId } = context.query;
  const { data } = await apolloClient.query({
    query: GET_ISSUE,
    variables: { id: parseInt(issueId) },
  });

  const { data: stances } = await apolloClient.query({
    query: GET_STANCES_BY_ISSUE,
    variables: { issuesId: parseInt(issueId) },
  });

  return {
    props: {
      issue_data: data,
      stances_data: stances,
    },
  };
};

const IssueDetail = props => {
  const issue_data = props.issue_data;
  const stances_data = props.stances_data;

  const initial_state = {
    issue: {
      id: null,
      title: '',
      content: '',
      imageUrl: '',
    },
    stances: [],
    addStanceMode: false,
    newStance: { title: '', orderNum: null, issuesId: null },
  };

  const [state, dispatch] = useReducer(reducer, initial_state);
  const { issue, addStanceMode, stances, newStance } = state;

  const [updateIssue, { data }] = useMutation(UPDATE_ISSUE);
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);
  const [upsertStance] = useMutation(UPSERT_STANCE);

  useEffect(() => {
    dispatch({
      type: 'FETCH_ISSUE',
      data: {
        id: issue_data && _.head(issue_data.issues).id,
        title: issue_data && _.head(issue_data.issues).title,
        content: issue_data && _.head(issue_data.issues).content,
        imageUrl: issue_data && _.head(issue_data.issues).imageUrl,
      },
    });

    dispatch({
      type: 'FETCH_STANCES',
      data: stances_data && stances_data.stancesByIssueId,
    });
  }, []);

  const handleChange = (value, key) => {
    dispatch({
      type: 'CHANGE_ISSUE_INPUT',
      payload: { key, value },
    });
  };

  const handleChangeStance = (value, stance) => {
    dispatch({
      type: 'UPDATE_ISSUE_STANCES',
      payload: { value, id: stance.id, orderNum: stance.orderNum }
    });
  };

  const handleSetStanceMode = () => {
    dispatch({
      type: 'SHOW_STANCE_INPUT',
    });
  };

  const handleNewStanceInput = value => {
    dispatch({
      type: 'INPUT_NEW_STANCE_TITLE',
      value: value,
    });
  };

  const handleAddStanceBtn = () => {
    const stanceIdx = _.isEmpty(stances) ? 1 : _.size(stances) + 1;
    const payload: Stance = { title: newStance, orderNum: stanceIdx, id: stanceIdx };

    dispatch({
      type: 'ADD_STANCE',
      value: payload,
    });
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
          dispatch({
            type: 'SET_IMAGE_URL',
            value: uploadedS3Url,
          });
        }));
  };

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={style.main} style={{ background: '#fff', position: 'relative' }}>
        <div className={style.wrapper}>
          <button
            className={style.btn_submit}
            style={{ marginTop: '50px' }}
            onClick={() => {
              try {
                updateIssue({
                  variables: {
                    id: issue.id,
                    title: issue.title,
                    content: issue.content,
                    imageUrl: issue.imageUrl,
                  },
                }).then(async () => {
                  state.stances.map(async stance => {
                    await upsertStance({
                      variables: {
                        id: stance.id,
                        title: state[`stance_${stance.id}`].title,
                        orderNum: stance.orderNum,
                        issuesId: issue.id
                      }
                    })
                  });
                })

                if (
                  confirm('수정이 완료되었습니다. 인덱스 페이지로 넘어갑니다.')
                ) {
                  window.location.href = `${config.host}/issues/${issue.id}`;
                }
              } catch (e) {
                alert('이슈 수정 중에 문제가 생겼어요! 개발자에게 문의해주세요')
                console.error(e)
              }
            }}
          >
            수정
          </button>

          <div className={style.img_wrapper}>
            <p className={style.title_sm}>대표 이미지</p>
            <img alt="issue_img" src={issue.imageUrl} />

            <div className={style.img_wrapper}>
              <p className={style.title_sm}>대표 이미지</p>
              <p>이미지를 업로드 해주세요</p>

              <input type="file" required onChange={handleFileChange} />
            </div>
          </div>
          <div className={style.title}>
            <p className={style.title_sm}>이슈 제목</p>
            <textarea value={issue.title} onChange={e => handleChange(e.target.value, 'title')} />
          </div>
          <div className={style.content}>
            <p className={style.title_sm}>이슈 설명</p>
            <textarea
              value={issue.content}
              onChange={e => handleChange(e.target.value, 'content')}
            />
          </div>

          {!_.isEmpty(stances) &&
            _.map(stances, stance => (
              <li className={style.option} key={stance.title}>
                <input value={state[`stance_${stance.id}`]?.title} onChange={e => handleChangeStance(e.target.value, stance)} />
              </li>
            ))}

          {addStanceMode && (
            <div className={style.option_wrapper}>
              <input onChange={e => handleNewStanceInput(e.target.value)} />
              <button onClick={handleAddStanceBtn}>+</button>
            </div>
          )}

          <button className={style.btn_add_option} onClick={handleSetStanceMode}>
            옵션 추가하기
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default IssueDetail;
