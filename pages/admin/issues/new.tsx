import React, { useReducer, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import _ from 'lodash';
import config from '../../../config';
import Layout from '../../../components/Layout';
import Select from 'react-select';

import style from './new.module.css';
import { initializeApollo } from '../../../apollo/apolloClient';
import Loading from '../../../components/Loading';
import AddTags from '../../../components/issue/AddTags';
import { GET_ALL_USERS, SINGLE_UPLOAD_IMG } from '../../../lib/graph_queries';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../../lib/requireAuthentication';
import { User } from 'next-auth';

interface Stance {
  title: String;
  orderNum: Number;
  IssueId: Number;
}

const GET_TAGS = gql`
  query FetchTags {
    hashTags {
      id
      name
    }
  }
`;

const CREATE_ISSUE = gql`
  mutation createIssue($title: String!, $content: String!, $imageUrl: String!, $authorId: String!) {
    createIssue(title: $title, content: $content, imageUrl: $imageUrl, authorId: $authorId) {
      id
      title
      content
      imageUrl
      authorId
    }
  }
`;

const CREATE_TAGS_BY_ISSUE = gql`
  mutation createTagsByIssue($data: [IssueHashTagInput]) {
    createTagsByIssue(data: $data) {
      count
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
    case 'CHANGE_ISSUE_INPUT':
      // eslint-disable-next-line no-case-declarations
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
        newStance: {
          ...state.newStance,
          title: action.value,
        },
      };
    case 'ADD_STANCE':
      return {
        ...state,
        stances: state.stances.concat(action.payload),
        addStanceMode: false,
      };
    case 'FETCH_HASHTAGS':
      return {
        ...state,
        tags: action.data,
      };
    case 'ADD_HASHTAG':
      return {
        ...state,
        tags: state.tags.concat(action.tag),
      };
    case 'SET_HASHTAGS':
      return {
        ...state,
        selected_tags: state.selected_tags.concat(action.tag),
      };
    case 'SET_IMAGE_URL':
      return {
        ...state,
        issue: {
          ...state.issue,
          imageUrl: action.value,
        },
      };
    case 'DELETE_IMAGE_URL':
      return {
        ...state,
        issue: {
          ...state.issue,
          imageUrl: '',
        }
      }
    default:
      return;
  }
};

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo(null);
    const { data } = await apolloClient.query({
      query: GET_TAGS,
    });
    const { data: usersData } = await apolloClient.query({
      query: GET_ALL_USERS,
    });

    return {
      props: {
        user: context.user,
        users: usersData.users,
        data,
      },
    };
  },
);

interface Props {
  user: User;
  users: [User];
  data: any;
}

const NewIssue = (props: Props) => {
  const router = useRouter();
  const initial_state = {
    issue: {
      title: '',
      content: '',
      imageUrl: '',
    },
    stances: [],
    newStance: { title: '', orderNum: null, issuesId: null },
    addStanceMode: false,
    tags: props.data.hashTags || [],
    selected_tags: [],
  };

  const [state, dispatch] = useReducer(reducer, initial_state);
  const [selectedUser, setSelectedUser] = useState(null);
  const { issue, addStanceMode, newStance, stances, tags, selected_tags } = state;

  const [createIssue] = useMutation(CREATE_ISSUE);
  const [createTagsByIssue] = useMutation(CREATE_TAGS_BY_ISSUE);
  const [createStancesByIssue] = useMutation(CREATE_STANCES_BY_ISSUE);

  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);

  const usersForSelect = props.users.map(user => {
    return { value: user.id, label: user.email };
  });

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
    const stanceIdx = _.isEmpty(stances) ? 0 : _.size(stances);
    const payload: Stance = {
      ...newStance,
      orderNum: stanceIdx,
    };

    dispatch({
      type: 'ADD_STANCE',
      payload: payload,
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

  const handleChange = (value, key) => {
    dispatch({
      type: 'CHANGE_ISSUE_INPUT',
      payload: { key: key, value: value },
    });
  };

  const handleDeleteImg = () => {
    dispatch({
      type: 'DELETE_IMAGE_URL',
    })
  }

  const handleSubmit = async () => {
    let createdIssueId;

    try {
      await createIssue({
        variables: {
          title: issue.title,
          content: issue.content,
          imageUrl: issue.imageUrl,
          authorId: selectedUser ? selectedUser.value : props.user.id,
        },
      })
        .then(result => {
          createdIssueId = result.data.createIssue.id;
        })
        .then(async () => {
          const tagsPayload = selected_tags.map(tag => {
            return { issuesId: createdIssueId, hashTagsId: tag.value };
          });

          await createTagsByIssue({
            variables: {
              data: tagsPayload,
            },
          });

          const stancesPayload = stances.map(stance => {
            return { title: stance.title, orderNum: stance.orderNum, issuesId: createdIssueId };
          });

          if (stancesPayload && stancesPayload.length) {
            await createStancesByIssue({
              variables: {
                data: stancesPayload,
              },
            });
          }

          if (
            window.confirm('????????? ??????????????? ?????????????????????. ?????? ?????? ???????????? ?????????????????????????')
          ) {
            window.location.href = `${config.host}/issues/${createdIssueId}`;
          } else {
            window.location.href = `${config.host}`;
          }
        });
    } catch (e) {
      console.error(e);
      alert('?????? ????????? ??????????????????. ???????????? ??????????????????');
    }
  };

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={style.main} style={{ background: '#fff' }}>
        <div className={style.button_wrapper}>
          <button className={style.btn_submit} style={{ marginTop: '30px' }} onClick={handleSubmit}>
            ????????????
          </button>
          <button className={style.btn_cancel} onClick={() => router.back()}>
            ????????????
          </button>
        </div>

        <div className={style.wrapper}>
          <div className={style.img_wrapper}>
            <p className={style.title_sm}>?????? ?????????</p>
            <p>???????????? ????????? ????????????</p>
            {issue.imageUrl !== '' ? (
              <div style={{ display: 'inline' }}>
                <img src={issue.imageUrl} alt="new_issue_img" />
                <button onClick={handleDeleteImg}>X</button>
              </div>
            ) : (
                <input type="file" required onChange={handleFileChange} />
            )}
          </div>
          <div className={style.title}>
            <p className={style.title_sm}>????????? ?????????</p>
            <Select value={selectedUser} onChange={setSelectedUser} options={usersForSelect} />
          </div>
          <div className={style.title}>
            <p className={style.title_sm}>?????? ??????</p>
            <textarea value={issue.title} onChange={e => handleChange(e.target.value, 'title')} />
          </div>
          <div className={style.content}>
            <p className={style.title_sm}>?????? ??????</p>
            <span className={style.comment}>
              ?????? ?????? ???, <strong>[text](URL)</strong> (ex. [?????????](https://www.naver.com))???
              ????????? ?????????.{' '}
              <a style={{ color: 'rgb(33, 111, 219)' }} href="">
                text
              </a>{' '}
              ????????? ???????????????.
            </span>
            <textarea
              wrap="hard"
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

          {stances.length < 5 ? (
            <button className={style.btn_add_option} onClick={handleSetStanceMode}>
              ?????? ????????????
            </button>
          ) : null}

          <AddTags 
            selected_tags={selected_tags}
            tags={tags}
            dispatch={dispatch}
          />

        </div>
      </main>
    </Layout>
  );
};
/* @ts-ignore */
export default NewIssue;
