import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import React, { useState } from 'react';
import { withApollo } from "../../apollo/client";
import { new_issue_var } from "../../apollo/localState.ts";
import { useReactiveVar, gql, useMutation } from '@apollo/client';
import _ from 'lodash';

const ADD_NEW_ISSUE = gql`
  mutation CreateIssue($title: String!, $content: String!) {
    createIssue(title: $title, content: $content) {
      title
      content
    }
  }
`;

const Post = (props) => {
    const {title, content, option_list} = useReactiveVar(new_issue_var);
    const [createIssue, { data }] = useMutation(ADD_NEW_ISSUE);

    const [add_option_mode, setAddOptionMode] = useState(false);
    const [new_option, setNewOption] = useState('');

    const handleChange = (value, key) => {
        const prev_var = new_issue_var();
        const curr_var = {...prev_var, [key]: value };

        return new_issue_var(curr_var);
    };

    const handleSetOptionMode = () => {
        setAddOptionMode(true);
    };

    const handleChangeNewOption = (value) => {
        setNewOption(value);
        setAddOptionMode(false);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Issue Post page</title>
            </Head>

            <main className={styles.main}>
                <button onClick={() => createIssue({ variables: { title: title, content: content }})}>발제하기</button>
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

            {!_.isEmpty(option_list) && _.forIn(option_list, ((option, idx) => (
                <div>{option[idx]}</div>
            )))}

            {add_option_mode && <input onChange={(e) => handleChangeNewOption(e.target.value)}/> }

            <button onClick={() => handleSetOptionMode()}>옵션 추가하기</button>

            <footer className={styles.footer}>
                Powered by 좌우지간
            </footer>
        </div>
    )
};


export default withApollo(Post);
