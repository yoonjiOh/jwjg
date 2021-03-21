import { useRouter } from 'next/router';
import React, {useReducer, useEffect } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {withApollo} from "../../apollo/client";
import _ from 'lodash';
import Layout from '../../components/Layout';
import common_style from "../index.module.css";
import style from "../new_issue/new_issue.module.css";

interface Stance {
    title: String,
    orderNum: Number,
    IssueId: Number
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

const GET_STANCES = gql`
    query stancesByIssueId($issuesId: Int!) {
        stancesByIssueId(issuesId: $issuesId) {
            id
            title
            orderNum
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
        case 'FETCH_STANCES':
            return {
                ...state,
                stances: action.data
            };
        case 'CHANGE_ISSUE_INPUT':
            const { key, value } = action.payload;
            return {
                ...state,
                [key]: value,
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
        default: return;
    }
};


const IssueDetail = () => {
    const router = useRouter();
    const issue_id = Number(router.query.id);

    const { data: issue_data } = useQuery(GET_ISSUE, { variables: { id: issue_id }});
    const { data: stances_data } = useQuery(GET_STANCES, { variables: { issuesId: issue_id }});

    console.log('stances_data', stances_data)

    const initial_state = {
        issue: {
            id: null,
            title: '',
            content: '',
            imageUrl: '',
        },
        stances: [],
        addStanceMode: false,
        newStance: { title: '', orderNum: null, issueId: null },
    };

    const [state, dispatch] = useReducer(reducer, initial_state);
    const { issue, addStanceMode, stances, newStance } = state;

    const [updateIssue, { data }] = useMutation(UPDATE_ISSUE);

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
            data: stances_data && stances_data.stancesByIssueId
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
            type: 'SHOW_STANCE_INPUT'
        });
    };

    const handleNewStanceInput = (value) => {
        dispatch({
            type: 'INPUT_NEW_STANCE_TITLE',
            value: value,
        });
    };

    const handleAddStanceBtn = () => {
        const stanceIdx = _.isEmpty(stances) ? 1 : _.size(stances) + 1;
        const payload: Stance = { ...newStance, orderNum: stanceIdx };

        dispatch({
            type: 'ADD_STANCE',
            value: payload
        });
    };

    return (
      <Layout title={"MAIN"}>
        <main className={common_style.main}>
            <button className={style.btn_submit}
                    onClick={() => updateIssue({ variables: { id: issue_id, title: issue.title, content: issue.content, option_list_json: JSON.stringify(issue.option_list) }})}>수정</button>

            <div className={style.wrapper}>
                <div className={style.img_wrapper}>
                    <p className={style.title_sm}>대표 이미지</p>
                    <img alt="issue_img" src={issue.imageUrl} />
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
                <input onChange={(e) => handleNewStanceInput(e.target.value)} />
                <button onClick={handleAddStanceBtn}>+</button>
            </div>}

            <button className={style.btn_add_option} onClick={handleSetStanceMode}>옵션 추가하기</button>
            </div>
        </main>
      </Layout>
    )
};

export default withApollo(IssueDetail, { ssr: true });
