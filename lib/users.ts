// import firebase from 'firebase/app';
import { SerializedAuthUser } from '../pages/users/additional_information';
import {
  EmailAlreadyExistError,
  FacebookLoginError,
  WrongEmailError,
  WrongPasswordFormatError,
} from './errors';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MINIMUM_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = '^(?=\\w*[a-zA-Z])(?=\\w*[0-9])';

export async function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email.toLowerCase())) {
    throw new WrongEmailError('The email format is invalid.');
  }
}

export async function validatePassword(password: string) {
  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    throw new WrongPasswordFormatError(
      'The password should be longer than ' + MINIMUM_PASSWORD_LENGTH + '.',
    );
  }
  if (!password.match(PASSWORD_REGEX)) {
    throw new WrongPasswordFormatError('비밀번호에는 특수문자를 사용할 수 없어요!');
  }
}

/**
 * @returns Returns true if user is newly created. Otherwise, it returns False.
 */
export async function createUserFromFirebaseUser(
  firebaseUser: SerializedAuthUser,
): Promise<Boolean> {
  console.log('firebaseUser:' + firebaseUser.id + '/' + firebaseUser.email);
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      firebaseUID: firebaseUser.id,
      email: firebaseUser.email,
    }),
  });

  // If user is newly created.
  if (response.status == 201) {
    return true;
  }

  if (!response.ok) {
    console.log(response);
    return false;
  }
  return await response.json();
}
