const functions = require("firebase-functions");
const allowedUsers = []; //make sure not to expose information on repo!

/** Creds to
 * https://stackoverflow.com/questions/56665475/how-to-check-if-user-with-the-email-entered-by-user-on-the-login-form-exists-or
 * and firebase security rules! See 'allowed' collection.
*/

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();


//TODO: client-side user verification with cloud functions. maybe profanity detection?
exports.detectAllowedUsers = functions.auth.user().onCreate((user) => {
    // if (user. in allowedUsers)
  
});