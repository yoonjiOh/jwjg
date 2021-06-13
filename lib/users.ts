import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from 'firebase/app';
import { JsonWebTokenError } from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { EmailAlreadyExistError, WeakPasswordError } from './errors';

// const authContext = createContext();

// export function ProvideAuth({ children }) {
//   const auth = useProvideAuth();
//   return <authContext.Provider value={auth}>{children}</authContext.Provider>;
// }

// export const useAuth = () => {
//   return useContext(authContext);
// };

// function useProvideAuth() {
//   const [user, setUser] = useState(null);

//   const doEmailSignup = (email, password) => {
//     return firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         var user = userCredential.user;
//         registerFirebaseUser(user);
//         setUser(user);
//         return user;
//       })
//       .catch(error => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log(errorCode);
//         console.log(errorMessage);

//         if (errorCode == 'auth/email-already-in-use') {
//           doEmailLogin(email, password);
//         }
//       });
//   };

//   const doEmailLogin = (email, password) => {
//     return firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         var user = userCredential.user;
//         registerFirebaseUser(user);
//         setUser(user);
//         return user;
//       })
//       .catch(error => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log(errorCode);
//         console.log(errorMessage);

//         if (errorCode == 'auth/wrong-password') {
//           alert('wrong password!');
//         }
//       });
//   };

//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         console.log('hey ho', user);
//         setUser(user);
//       } else {
//         setUser(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return {
//     user,
//     doEmailSignup,
//     doEmailLogin,
//   };
// }

export async function doEmailSignup(email, password) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;

      // Creates user in our backend.
      return registerFirebaseUser(user);
    })
    .catch(async error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // TODO: remove this.
      console.log(errorCode);
      console.log(errorMessage);

      if (errorCode == 'auth/email-already-in-use') {
        throw new EmailAlreadyExistError(errorMessage);
      } else if (errorCode == 'auth/weak-password') {
        throw new WeakPasswordError(errorMessage);
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
async function registerFirebaseUser(firebaseUser): Promise<boolean> {
  console.log('firebaseUser:' + firebaseUser.uid + '/' + firebaseUser.email);
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      firebaseUID: firebaseUser.uid,
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
  var provider = new firebase.auth.FacebookAuthProvider();
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
      var credential = result.credential;

      // The signed-in user info.
      var user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // @ts-ignore
      var accessToken = credential.accessToken;

      // ...
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
}
