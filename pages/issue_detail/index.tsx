import { useRouter } from 'next/router';
import React, {useReducer, useEffect } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {withApollo} from "../../apollo/client";
import _ from 'lodash';
import Layout from '../../components/Layout';
import common_style from "../index.module.css";
import style from "../new_issue/new_issue.module.css";


const GET_ISSUE = gql`
    query issues($id: Int!) {
        issues(id: $id) {
            id
            title
            content
            option_list_json
        }
    }
`;

const UPDATE_ISSUE = gql`
    mutation updateIssue($id: Int!, $title: String!, $content: String!, $option_list_json: String!) {
        updateIssue(id: $id, title: $title, content: $content, option_list_json: $option_list_json) {
            id
            title
            content
            option_list_json
        }
    }
`;

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_ISSUE':
            return {
                ...state,
                issue: action.data
            };
        case 'CHANGE_ISSUE_INPUT':
            const { key, value } = action.payload;
            return {
                ...state,
                [key]: value,
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
                option_list: action.value
            };
        default: return;
    }
};


const IssueDetail = () => {
    const router = useRouter();
    const issue_id = Number(router.query.id);

    const { loading, error, data: first_data } = useQuery(GET_ISSUE, { variables: { id: issue_id }});

    const initial_state = {
        issue: {
            id: null,
            title: '',
            content: '',
            option_list: {},
        },
        add_option_mode: false,
        new_option: ''
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { issue, add_option_mode, new_option } = state;

    const [updateIssue, { data }] = useMutation(UPDATE_ISSUE);

    useEffect(() => {
        dispatch({
            type: 'FETCH_ISSUE',
            data: {
                id: first_data && _.head(first_data.issues).id,
                title: first_data && _.head(first_data.issues).title,
                content: first_data && _.head(first_data.issues).content,
                option_list: first_data && _.head(first_data.issues).option_list_json ? JSON.parse(_.head(first_data.issues).option_list_json) : {},
            },
        });
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

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <Layout title={"MAIN"}>
        <main className={common_style.main}>
            <button className={style.btn_submit}
                    onClick={() => updateIssue({ variables: { id: issue_id, title: issue.title, content: issue.content, option_list_json: JSON.stringify(issue.option_list) }})}>수정</button>

            <div className={style.wrapper}>
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
            </div>
        </main>
      </Layout>
    )
};

export default withApollo(IssueDetail, { ssr: true });
