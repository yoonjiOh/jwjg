import styles from "../../styles/Home.module.css";
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import React, {useReducer, useEffect } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {withApollo} from "../../apollo/client";
import _ from 'lodash';


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

// useReducer 써서 상태를 관리해주자
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


const IssueDetail = () => {
    const router = useRouter();
    const issue_id = Number(router.query.id);

    const { loading, error, data: first_data } = useQuery(GET_ISSUE, { variables: { id: issue_id }});

    const initial_state = {
        title: first_data ? _.head(first_data.issues).title : '',
        content: first_data ? _.head(first_data.issues).content : '',
        option_list: first_data && _.head(first_data.issues).option_list_json ? JSON.parse(_.head(first_data.issues).option_list_json) : {},
        add_option_mode: false,
        new_option: ''
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { title, content, option_list, add_option_mode, new_option } = state;

    const [updateIssue, { data }] = useMutation(UPDATE_ISSUE);

    useEffect(() => {
        // 얘는 데이터 업데이트 순서를 위해 필요한데, 이 안에 어떤 추가적인 일을 할 지는 좀 더 봐야 함 BY yoonji
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
        const option_idx = _.isEmpty(option_list) ? 1 : _.size(option_list) + 1;
        const new_option_list = { ...option_list, [option_idx]: new_option };

        dispatch({
            type: 'ADD_OPTION',
            value: new_option_list
        });
    };

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                <button onClick={() => updateIssue({ variables: { id: issue_id, title: title, content: content, option_list_json: JSON.stringify(option_list) }})}>발제하기</button>

                <form>
                    <div>
                        <p>이슈 제목</p>
                        <textarea value={title} onChange={(e) => handleChange(e.target.value, 'title')} />
                    </div>
                    <div>
                        <p>이슈 설명하기</p>
                        <textarea value={content} onChange={(e) => handleChange(e.target.value, 'content')} />
                    </div>
                </form>
            </main>

            {!_.isEmpty(option_list) && _.map(_.values(option_list), (option) => (
                <div key={option}>{option}</div>
            ))}

            {add_option_mode &&
						<div><input onChange={(e) => handleNewOptionInput(e.target.value)}/><button onClick={handleAddOptionBtn}>+</button></div>}

            <button onClick={handleSetOptionMode}>옵션 추가하기</button>

            <footer className={styles.footer}>
                Powered by 좌우지간
            </footer>
        </div>
    )
}

export default withApollo(IssueDetail, { ssr: true });
