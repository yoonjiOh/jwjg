import React from "react";
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';
import style from './users.module.scss';
import Link from 'next/link';
import FirebaseAuth from '../../components/FirebaseAuth';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event) {
      // @ts-ignore
      alert('A email/password was submitted: ' + this.state.email + '/' + this.state.password);
      event.preventDefault();
    }

    render() {
        return (
            <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }}>
                <main className={common_style.main}>
                    <div>
                        <FirebaseAuth />
                    </div>
                </main>
            </Layout>
        );
    }
}

export default LoginForm;