import React from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
// import FirebaseAuth from '../../components/FirebaseAuth'
import RegistrationForm from './RegistrationForm';

const styles = {
  content: {
    padding: `8px 32px`,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 16,
  },
};

const Registration = () => <RegistrationForm />;

export default Registration;
