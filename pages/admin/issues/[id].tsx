import { useRouter } from 'next/router';
import React, { useReducer, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import Layout from '../../../components/Layout';
import style from './new.module.css';
import { initializeApollo } from '../../../apollo/apolloClient';
import { GET_STANCES_BY_ISSUE, SINGLE_UPLOAD_IMG } from '../../../lib/queries';

interface Stance {
  title: String;
  orderNum: Number;
  issuesId: Number;
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

const CREATE_STANCES_BY_ISSUE = gql`
  mutation createStancesByIssue($data: [IssueStancesInput]) {
    createStancesByIssue(data: $data) {
      count
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
    case 'FETCH_STANCES':
      return {
        ...state,
        stances: action.data,
      };
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
    case 'ADD_STANCE':
      return {
        ...state,
        stances: state.stances.concat(action.value),
        addStanceMode: false,
      };
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
  const { id } = context.query;
  const { data } = await apolloClient.query({
    query: GET_ISSUE,
    variables: { id: parseInt(id) },
  });

  const { data: stances } = await apolloClient.query({
    query: GET_STANCES_BY_ISSUE,
    variables: { issuesId: parseInt(id) },
  });

  return {
    props: {
      issue_data: data,
      stances_data: stances,
    },
  };
};

const IssueDetail = props => {
  const router = useRouter();
  const issue_id = Number(router.query.id);

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
  const [createStancesByIssue] = useMutation(CREATE_STANCES_BY_ISSUE);
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);

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
      payload: { key: key, value: value },
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
    const payload: Stance = { title: newStance, orderNum: stanceIdx, issuesId: issue_id };

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
            onClick={() =>
              updateIssue({
                variables: {
                  id: issue_id,
                  title: issue.title,
                  content: issue.content,
                  imageUrl: issue.imageUrl,
                },
              }).then(async () => {
                state.stances.map(async stance => {
                  if (!_.has(stance, 'id')) {
                    await createStancesByIssue({
                      variables: {
                        data: stance,
                      },
                    });
                  }
                });
              })
            }
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
                {stance.title}
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
