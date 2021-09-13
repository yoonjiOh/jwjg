import React, { useReducer, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import _ from 'lodash';
import config from '../../../config';
import Layout from '../../../components/Layout';

import style from './new.module.css';
import { initializeApollo } from '../../../apollo/apolloClient';
import Loading from '../../../components/Loading';
import { GET_USERS, SINGLE_UPLOAD_IMG } from '../../../lib/graph_queries';
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

const CREATE_TAG = gql`
  mutation createTag($name: String!) {
    createTag(name: $name) {
      id
      name
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

    return {
      props: {
        user: context.user,
        data,
      },
    };
  },
);

interface Props {
  user: User;
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
  const { issue, addStanceMode, newStance, stances, tags, selected_tags } = state;

  const [newTag, setNewTag] = useState('');
  const [addTagErr, setAddTagErr] = useState(null);
  const [createIssue] = useMutation(CREATE_ISSUE);
  const [createTagsByIssue] = useMutation(CREATE_TAGS_BY_ISSUE);
  const [createStancesByIssue] = useMutation(CREATE_STANCES_BY_ISSUE);
  const [createTag] = useMutation(CREATE_TAG);

  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD_IMG);

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

  const handleSelectTag = e => {
    dispatch({
      type: 'SET_HASHTAGS',
      tag: { id: e.target.id, value: +e.target.value },
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

  const handleChangeTagInput = value => {
    setAddTagErr(null);
    setNewTag(value);
  };

  const handleClickAddTagBtn = async () => {
    if (newTag.length === 0) {
      return setAddTagErr('태그명을 입력해주세요');
    }

    if (
      tags.find(tag => {
        return tag.name === newTag.trim();
      })
    ) {
      return setAddTagErr('이미 등록되어 있는 태그 입니다.');
    }

    try {
      await createTag({
        variables: {
          name: newTag,
        },
      }).then(result => {
        dispatch({
          type: 'ADD_HASHTAG',
          tag: {
            id: result.data.createTag.id,
            name: result.data.createTag.name,
          },
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    let createdIssueId;

    try {
      await createIssue({
        variables: {
          title: issue.title,
          content: issue.content,
          imageUrl: issue.imageUrl,
          authorId: props.user.id,
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

          await createStancesByIssue({
            variables: {
              data: stancesPayload,
            },
          });

          if (
            window.confirm('이슈가 성공적으로 발제되었습니다. 해당 이슈 페이지로 넘어가시겠습니까?')
          ) {
            window.location.href = `${config.host}/issues/${createdIssueId}`;
          } else {
            window.location.href = `${config.host}`;
          }
        });
    } catch (e) {
      console.error(e);
      alert('이슈 발제에 실패했습니다. 개발팀에 문의해주세요');
    }
  };

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  return (
    <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={style.main} style={{ background: '#fff' }}>
        <div className={style.button_wrapper}>
          <button className={style.btn_submit} style={{ marginTop: '30px' }} onClick={handleSubmit}>
            발제하기
          </button>
          <button className={style.btn_cancel} onClick={() => router.back()}>
            작성취소
          </button>
        </div>

        <div className={style.wrapper}>
          <div className={style.img_wrapper}>
            <p className={style.title_sm}>대표 이미지</p>
            <p>이미지를 업로드 해주세요</p>
            {issue.imageUrl !== '' ? (
              <img src={issue.imageUrl} alt="new_issue_img" />
            ) : (
              <input type="file" required onChange={handleFileChange} />
            )}
          </div>
          <div className={style.title}>
            <p className={style.title_sm}>이슈 제목</p>
            <textarea value={issue.title} onChange={e => handleChange(e.target.value, 'title')} />
          </div>
          <div className={style.content}>
            <p className={style.title_sm}>이슈 설명</p>
            <span className={style.comment}>
              링크 입력 시, <strong>[text](URL)</strong> (ex. [네이버](https://www.naver.com))로
              입력해 주세요.{' '}
              <a style={{ color: 'rgb(33, 111, 219)' }} href="">
                text
              </a>{' '}
              형태로 출력됩니다.
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
              옵션 추가하기
            </button>
          ) : null}

          <div>선택된 태그: {selected_tags.map(tag => tag.id).join(', ')}</div>

          <div className={style.title_sm} style={{ marginBottom: '15px' }}>
            태그 선택
          </div>

          <select name="tag" multiple id="tag-select" className={style.select}>
            {tags &&
              tags.map(tag => {
                const isSelected = selected_tags.filter(t => t.value === tag.id).length;

                return (
                  <option
                    onClick={handleSelectTag}
                    disabled={!!isSelected}
                    id={tag.name}
                    value={tag.id}
                    key={tag.id}
                  >
                    {tag.name}
                  </option>
                );
              })}
          </select>

          <div className={style.title_sm} style={{ margin: '15px 0' }}>
            태그 추가
          </div>

          <div className={style.option_wrapper}>
            <p style={{ color: 'red' }}>{addTagErr}</p>
            <input onChange={e => handleChangeTagInput(e.target.value)} />
            <button onClick={handleClickAddTagBtn}>+</button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
/* @ts-ignore */
export default NewIssue;
