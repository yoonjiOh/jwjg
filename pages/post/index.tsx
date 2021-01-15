import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { withApollo } from "../../apollo/client";
import { new_issue_var } from "../../apollo/localState";
import { useReactiveVar, gql, useMutation } from '@apollo/client';

const ADD_NEW_ISSUE = gql`
  mutation AddNewIssue($type: String!) {
    addTodo(type: $type) {
      title
      type
    }
  }
`;

const Post = (props) => {
    const {issue_title, issue_detail} = useReactiveVar(new_issue_var);

    const handleChange = (value, key) => {
        const prev_var = new_issue_var();
        const curr_var = {...prev_var, [key]: value };

        return new_issue_var(curr_var);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Issue Post page</title>
            </Head>

            <main className={styles.main}>
                <button>발제하기</button>
                <form>
                    <div>
                        <p>이슈 제목</p>
                        <textarea value={issue_title} onChange={(e) => handleChange(e.target.value, 'issue_title')} />
                    </div>
                    <div>
                        <p>이슈 설명하기</p>
                        <textarea value={issue_detail} onChange={(e) => handleChange(e.target.value, 'issue_detail')} />
                    </div>
                </form>
            </main>

            <footer className={styles.footer}>
                Powered by 좌우지간
            </footer>
        </div>
    )
};


export default withApollo(Post);
