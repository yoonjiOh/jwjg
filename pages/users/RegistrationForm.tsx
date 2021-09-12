import React from 'react';
// import FirebaseAuth from '../../components/FirebaseAuth';
import Layout from '../../components/Layout';
import common_style from '../index.module.scss';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <Layout title={'MAIN'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
        <main className={common_style.main}>
          <div>{/* <FirebaseAuth /> */}</div>
        </main>
      </Layout>
    );
  }
}

export default LoginForm;
