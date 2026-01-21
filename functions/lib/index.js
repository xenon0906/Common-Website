"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Placeholder function - add your functions here
exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello from Snapgo!");
});
//# sourceMappingURL=index.js.map