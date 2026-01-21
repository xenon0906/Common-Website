import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Placeholder function - add your functions here
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Snapgo!");
});
