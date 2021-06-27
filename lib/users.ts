import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from 'firebase/app';
import { JsonWebTokenError } from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { WrongEmailError, EmailAlreadyExistError, WrongPasswordFormatError } from './errors';
import { AuthUser } from 'next-firebase-auth';
import { SerializedAuthUser } from '../pages/users/additional_information';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    //   // Signed in
    //   const user = userCredential.user;
    //   return user;
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
): Promise<boolean> {
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
  provider.addScope('user_birthday');
  // To localize the provider's OAuth flow to the user's preferred language
  firebase.auth().useDeviceLanguage();
  provider.setCustomParameters({
    display: 'popup',
  });

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;

      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // @ts-ignore
      const accessToken = credential.accessToken;

      // ...
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;

      // ...
    });
}
