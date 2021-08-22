import firebase from 'firebase/app';
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

  firebase
    .auth()
    .fetchSignInMethodsForEmail(email)
    .then(providers => {
      if (providers.length != 0) {
        throw new WrongEmailError('The email already in used.');
      }
    });
}

export async function validatePassword(password: string) {
  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    throw new WrongPasswordFormatError(
      'The password should be longer than ' + MINIMUM_PASSWORD_LENGTH + '.',
    );
  }
  if (!password.match(PASSWORD_REGEX)) {
    throw new WrongPasswordFormatError('The password should contain both alphabets and numbers.');
  }
}

export async function firebaseUserSignup(email, password) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {})
    .catch(async error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // TODO: remove this.
      console.log(errorCode);
      console.log(errorMessage);

      if (errorCode == 'auth/email-already-in-use') {
        throw new EmailAlreadyExistError(errorMessage);
      } else if (errorCode == 'auth/weak-password') {
        throw new WrongPasswordFormatError(errorMessage);
      }
      throw Error(errorMessage);
    });
}

export async function doEmailLogin(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    // .then(userCredential => {
    //   console.log(userCredential);
    // })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);

      if (errorCode == 'auth/wrong-password') {
        alert('wrong password!');
      }
    });
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
    // throw new Error(response.statusText);
  }
  return await response.json();
  // Checks if user already exists.
  // const user = await prisma.users.findUnique({
  //     where: {
  //         firebaseUID: firebaseUser.id
  //     }
  // })
  // if (!user) {
  //     user = await prisma.users.create({
  //         data: {
  //             firebaseUID: firebaseUser.id
  //         }
  //     })
  // }
}

export function startFacebookSigninFlow() {
  const provider = new firebase.auth.FacebookAuthProvider();
  // TODO: updates scopes
  // Every permission below requires App Review except for email and public_profile.
  // https://developers.facebook.com/docs/app-review
  provider.addScope('email');
  // To localize the provider's OAuth flow to the user's preferred language
  firebase.auth().useDeviceLanguage();
  provider.setCustomParameters({
    display: 'popup',
  });

  return firebase.auth().signInWithRedirect(provider);
  // .signInWithPopup(provider)
  // .then(result => {
  //   /** @type {firebase.auth.OAuthCredential} */
  //   const credential = result.credential;

  //   // // This gives you a Google Access Token. You can use it to access the Google API.
  //   // const token = credential.accessToken;
  //   // // The signed-in user info.
  //   // const user = result.user;
  //   // ...
  // })
  // .catch(async error => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;

  //   // TODO: remove logging.
  //   console.log(errorCode);
  //   console.log(errorMessage);

  //   throw new FacebookLoginError(
  //     `Failed to login via facebook, errorCode(${errorCode}) errorMessage(${errorMessage})`,
  //   );
  // });
}
