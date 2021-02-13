import Header from '../../components/Header';
import styles from '../../styles/Home.module.css'
import React, {useReducer} from 'react';
import { withApollo } from "../../apollo/client";
import {gql, useMutation, useQuery} from '@apollo/client';
import { useRouter } from 'next/router';
import Select from 'react-select';
import _ from 'lodash';


const GET_TAGS = gql`
    query FetchTags {
        tags {
            id
            name
        }
    }
`;

const CREATE_ISSUE = gql`
    mutation createIssue($title: String!, $content: String!, $option_list_json: String!) {
        createIssue(title: $title, content: $content, option_list_json: $option_list_json) {
            title,
            content,
            option_list_json
        }
    }
`;

const reducer = (state, action) => {
    switch (action.type) {
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

const NewIssue = () => {
    const { loading, error, data } = useQuery(GET_TAGS);

    const router = useRouter();
    const initial_state = {
        issue: {
            title: '',
            content: '',
            option_list: {},
        },
        add_option_mode: false,
        new_option: '',
        // tags: data,
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { issue, add_option_mode, new_option, tags } = state;

    const [createIssue] = useMutation(CREATE_ISSUE);

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

    // console.log('tags state', tags)

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <button onClick={() => createIssue({ variables: { title: issue.title, content: issue.content, option_list_json: JSON.stringify(issue.option_list) }})}>발제하기</button>
                <span onClick={() => router.back()}>작성취소</span>
                <form>
                    <div>
                        <p>이슈 제목</p>
                        <textarea value={issue.title} onChange={(e) => handleChange(e.target.value, 'title')} />
                    </div>
                    <div>
                        <p>이슈 설명</p>
                        <textarea value={issue.content} onChange={(e) => handleChange(e.target.value, 'content')} />
                    </div>
                </form>
            </main>

            {add_option_mode &&
						<div><input onChange={(e) => handleNewOptionInput(e.target.value)}/><button onClick={handleAddOptionBtn}>+</button></div>}

            <button onClick={handleSetOptionMode}>옵션 추가하기</button>

            <span>태그 선택</span>

            <footer className={styles.footer}>
                Powered by 좌우지간
            </footer>
        </div>
    )
};


export default withApollo(NewIssue, { ssr: true });
