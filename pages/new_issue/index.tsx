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


const GET_TAGS = gql`
    query FetchTags {
        tags {
            id
            name
        }
    }
`;

const CREATE_ISSUE = gql`
    mutation createIssue($title: String!, $content: String!, $img_url: String!, $option_list_json: String!) {
        createIssue(title: $title, content: $content, img_url: $img_url, option_list_json: $option_list_json) {
            id
            title,
            content,
            img_url,
            option_list_json
        }
    }
`;

const CREATE_TAGS_BY_ISSUE = gql`
    mutation createTagsByIssue($data: [IssueHasTagInput]) {
        createTagsByIssue(data: $data) {
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
        case 'SHOW_OPTION_INPUT':
            return {
                ...state,
                add_option_mode: true
            };
        case 'INPUT_NEW_OPTION':
            return {
                ...state,
                new_option: action.value
            };
        case 'ADD_OPTION':
            return {
                ...state,
                issue: {
                    ...state.issue,
                    option_list: action.value
                },
                add_option_mode: false
            };
        case 'FETCH_TAGS':
            console.log('FETCH_TAGS', action.data)
            return {
                ...state,
                tags: action.data
            };
        case 'SET_TAGS':
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
            img_url: '',
            option_list: {},
        },
        add_option_mode: false,
        new_option: '',
        tags: [],
        selected_tags: [],
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { issue, add_option_mode, new_option, tags, selected_tags } = state;

    const [createIssue] = useMutation(CREATE_ISSUE);
    const [createTagsByIssue] = useMutation(CREATE_TAGS_BY_ISSUE);

    useEffect(() => {
        dispatch({
            type: 'FETCH_TAGS',
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
            type: 'SHOW_OPTION_INPUT'
        });
    };

    const handleNewOptionInput = (value) => {
        dispatch({
            type: 'INPUT_NEW_OPTION',
            value: value,
        });
    };

    const handleAddOptionBtn = () => {
        const option_idx = _.isEmpty(issue.option_list) ? 1 : _.size(issue.option_list) + 1;
        const new_option_list = { ...issue.option_list, [option_idx]: new_option };

        dispatch({
            type: 'ADD_OPTION',
            value: new_option_list
        });
    };

    const handleTagSelect = (selected_tags) => {
        dispatch({
            type: 'SET_TAGS',
            data: selected_tags
        })
    };

    const handleSubmit = async () => {
        let created_issue_id;

        try {
            await createIssue({
                variables: {
                    title: issue.title,
                    content: issue.content,
                    img_url: issue.img_url,
                    option_list_json: JSON.stringify(issue.option_list)
                }
            }).then((result) => {
                created_issue_id = result.data.createIssue.id;
            }).then(() => {
                const payload = selected_tags.map((tag) => {
                    return { issue_id: created_issue_id, tag_id: tag.value }
                });

                createTagsByIssue({
                    variables: {
                        data: payload
                    }
                });

                if (window.confirm('이슈가 성공적으로 발제되었습니다. 해당 이슈 페이지로 넘어가시겠습니까?')) {
                    window.location.href = `${config.host}/${created_issue_id}`;
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
                    <img alt="new_issue_img" src={issue.img_url} />
                </div>
                <div className={style.title}>
                    <p className={style.title_sm}>이슈 제목</p>
                    <textarea value={issue.title} onChange={(e) => handleChange(e.target.value, 'title')} />
                </div>
                <div className={style.content}>
                    <p className={style.title_sm}>이슈 설명</p>
                    <textarea value={issue.content} onChange={(e) => handleChange(e.target.value, 'content')} />
                </div>

                {!_.isEmpty(issue.option_list) && _.map(_.values(issue.option_list), (option) => (
                  <li className={style.option} key={option}>{option}</li>
                ))}

                {add_option_mode &&
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
