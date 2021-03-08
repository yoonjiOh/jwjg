import React, {useReducer, useEffect} from 'react';
import { withApollo } from "../../apollo/client";
import {gql, useMutation, useQuery} from '@apollo/client';
import { useRouter } from 'next/router';
import Select from 'react-select';
import _ from 'lodash';
import config from '../../config';
import Layout from '../../components/Layout';
import common_style from "../index.module.css";
import style from "./new_issue.module.css";

interface Stance {
    title: String,
    orderNum: Number,
    IssueId: Number
}

const GET_TAGS = gql`
    query FetchTags {
        hashTags {
            id
            content
        }
    }
`;

const CREATE_ISSUE = gql`
    mutation createIssue($title: String!, $content: String!, $imageUrl: String!, $option_list_json: String!) {
        createIssue(title: $title, content: $content, imageUrl: $imageUrl, option_list_json: $option_list_json) {
            id
            title,
            content,
            imageUrl,
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
            const { key, value } = action.payload;
            return {
                ...state,
                issue: {
                    ...state.issue,
                    [key]: value
                },
            };
        case 'SHOW_STANCE_INPUT':
            return {
                ...state,
                addStanceMode: true
            };
        case 'INPUT_NEW_STANCE_TITLE':
            return {
                ...state,
                newStance: action.value
            };
        case 'ADD_STANCE':
            return {
                ...state,
                stances: state.stances.concat(action.value),
                addStanceMode: false
            };
        case 'FETCH_HASHTAGS':
            return {
                ...state,
                tags: action.data
            };
        case 'SET_HASHTAGS':
            return {
                ...state,
                selected_tags: action.data
            };
        default: return;
    }
};

const NewIssue = () => {
    const { loading, error, data } = useQuery(GET_TAGS);

    const router = useRouter();
    const initial_state = {
        issue: {
            title: '',
            content: '',
            imgUrl: '',
        },
        stances: [],
        newStance: { title: '', orderNum: null, issueId: null },
        addStanceMode: false,
        tags: [],
        selected_tags: [],
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { issue, addStanceMode, newStance, stances, tags, selected_tags } = state;

    const [createIssue] = useMutation(CREATE_ISSUE);
    const [createTagsByIssue] = useMutation(CREATE_TAGS_BY_ISSUE);
    const [createStancesByIssue] = useMutation(CREATE_STANCES_BY_ISSUE);

    useEffect(() => {
        dispatch({
            type: 'FETCH_HASHTAGS',
            data: data && data.tags.map(tag => { return { value: tag.id, label: tag.name }})
        })
    }, []);

    const handleChange = (value, key) => {
        dispatch({
            type: 'CHANGE_ISSUE_INPUT',
            payload: { key: key, value: value },
        });
    };

    const handleSetOptionMode = () => {
        dispatch({
            type: 'SHOW_STANCE_INPUT'
        });
    };

    const handleNewOptionInput = (value) => {
        dispatch({
            type: 'INPUT_NEW_STANCE_TITLE',
            value: value,
        });
    };

    const handleAddOptionBtn = () => {
        const stanceIdx = _.isEmpty(stances) ? 1 : _.size(stances) + 1;
        const payload: Stance = { ...newStance, orderNum: stanceIdx };

        dispatch({
            type: 'ADD_STANCE',
            value: payload
        });
    };

    const handleTagSelect = (selectedHashTags) => {
        dispatch({
            type: 'SET_HASHTAGS',
            data: selectedHashTags
        })
    };

    const handleSubmit = async () => {
        let createdIssueId;

        try {
            await createIssue({
                variables: {
                    title: issue.title,
                    content: issue.content,
                    imgUrl: issue.imgUrl,
                }
            }).then((result) => {
                createdIssueId = result.data.createIssue.id;
            }).then(() => {
                const tagsPayload = selected_tags.map((tag) => {
                    return { issueId: createdIssueId, hashTagsId: tag.value }
                });

                createTagsByIssue({
                    variables: {
                        data: tagsPayload
                    }
                });

                const stancesPayload = stances.map((stance) => {
                    return { title: stance.title, orderNum: stance.orderNum, issueId: createdIssueId }
                });

                createStancesByIssue({
                    variables: {
                        data: stancesPayload
                    }
                });

                if (window.confirm('이슈가 성공적으로 발제되었습니다. 해당 이슈 페이지로 넘어가시겠습니까?')) {
                    window.location.href = `${config.host}/${createdIssueId}`;
                } else {
                    window.location.href = `${config.host}`;
                }
            });
        } catch (e) {
            console.error(e)
        }
    };

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <Layout title={"MAIN"}>
        <main className={common_style.main}>
            <div className={style.button_wrapper}>
              <button className={style.btn_submit} onClick={handleSubmit}>발제하기</button>
              <button className={style.btn_cancel} onClick={() => router.back()}>작성취소</button>
            </div>

            <div className={style.wrapper}>
                <div className={style.img_wrapper}>
                    <p className={style.title_sm}>대표 이미지</p>
                    <img alt="new_issue_img" src={issue.imgUrl} />
                </div>
                <div className={style.title}>
                    <p className={style.title_sm}>이슈 제목</p>
                    <textarea value={issue.title} onChange={(e) => handleChange(e.target.value, 'title')} />
                </div>
                <div className={style.content}>
                    <p className={style.title_sm}>이슈 설명</p>
                    <textarea value={issue.content} onChange={(e) => handleChange(e.target.value, 'content')} />
                </div>

                {!_.isEmpty(stances) && _.map(stances, (stance) => (
                  <li className={style.option} key={stance.title}>{stance.title}</li>
                ))}

                {addStanceMode &&
                <div className={style.option_wrapper}>
                    <input onChange={(e) => handleNewOptionInput(e.target.value)} />
                    <button onClick={handleAddOptionBtn}>+</button>
                </div>}

                <button className={style.btn_add_option} onClick={handleSetOptionMode}>옵션 추가하기</button>

                <p className={style.title_sm} style={{ marginBottom: "15px" }}>태그 선택</p>
                <Select
                  isMulti
                  name="tags"
                  options={tags}
                  className="tags-multi-select"
                  onChange={handleTagSelect}
                />
            </div>
        </main>
      </Layout>
    )
};


export default withApollo(NewIssue, { ssr: true });
