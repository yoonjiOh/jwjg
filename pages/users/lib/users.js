import { prisma } from ".prisma/client";
import firebase from "firebase/app";

function registerFirebaseUser(firebaseUser) {
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

export function doEmailSignup(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            registerFirebaseUser(user);
            console.log(user);
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);

            if (errorCode == 'auth/email-already-in-use') {
                doEmailLogin(email, password);
            }
        });
}
export function doEmailLogin(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            registerFirebaseUser(user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);

            if (errorCode == 'auth/wrong-password') {
                alert('wrong password!');
            }

        });
}

export function startFacebookSigninFlow() {
    var provider = new firebase.auth.FacebookAuthProvider();
    // TODO: updates scopes
    provider.addScope('user_birthday');
    // To localize the provider's OAuth flow to the user's preferred language
    firebase.auth().useDeviceLanguage();
    provider.setCustomParameters({
        'display': 'popup'
    });

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // The signed-in user info.
            var user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;

            // ...
        })
        .catch((error) => {
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