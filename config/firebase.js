const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "txiprt.appspot.com" // <--- Your actual bucket name
});

const remoteConfig = admin.remoteConfig();
const db = admin.firestore(); // <--- ADDED: Initialize Firestore

// ADDED db to the exports
module.exports = { admin, remoteConfig, db };

