import { withAuthUser, AuthAction } from 'next-firebase-auth';
import Layout from '../../components/Layout';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import common_style from '../index.module.scss';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
// import firebase from 'firebase/app';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';

const headerTitle = '비밀번호 찾기';

function ResetPassword() {
  // const auth = firebase.auth();

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [error, setError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    // Email address validation.
    if (!email.includes('@')) {
      setError(true);
      setErrorText('Email address format is invalid.');
      return;
    }
  };

  const headerInfo = {
    headerType: 'editMode',
    subTitle: headerTitle,
  };

  const handleChange = e => {
    e.preventDefault();
    setEmail(e.target.value);
    setError(false);
    setErrorText('');
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Layout title={headerTitle} headerInfo={headerInfo} isDimmed={false}>
      <main className={common_style.main}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <TextField
              id="email"
              label="Email(i.e abc@def.com)"
              value={email}
              onChange={handleChange}
              helperText={errorText}
              variant="outlined"
              error={error}
            />
            <Button type="submit" variant="outlined" color="primary">
              Send pwd reset email
            </Button>
          </FormGroup>
        </form>
      </main>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnackbar}
        onClose={handleClose}
        message="email sent!"
      />
    </Layout>
  );
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(ResetPassword);
