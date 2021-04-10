import React from "react";
import Layout from '../../components/Layout';
import common_style from '../index.module.css';
import style from './users.module.css';
import Link from 'next/link';
import FirebaseAuth from '../../components/FirebaseAuth';
import RegistrationWidget from './RegistrationWidget'
import { doEmailLogin } from "./lib/users"

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
    event.preventDefault();
    doEmailLogin(this.state.email, this.state.password);
  }

  render() {
    return (
      <Layout title={'Registration'} headerInfo={{ headerType: 'editMode' }}>
        <main className={common_style.main}>
          <form onSubmit={this.handleSubmit}>
            <label className={style.label_default}>
              이메일
            <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
            </label>
            <label className={style.label_default}>
              비밀번호
            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
            </label>
            <input type="submit" value="로그인" className={style.btn_active} />
          </form>

          <button className={style.btn_default}>
            <Link href={`/`}>비밀번호 찾기</Link>
          </button>

          <div>
            <RegistrationWidget />
          </div>

          {/* <button className={style.btn_default}>
            <Link href={`/users/registration`}>이메일로 시작하기</Link>
          </button>
          <button className={style.btn_default}>
            <Link href={`/`}>Facebook으로 시작하기</Link>
          </button> */}
        </main>
      </Layout>
    );
  }
}

export default LoginForm;