const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
    storageBucket: "txiprt.appspot.com" // <--- REPLACE with your actual bucket name

});

const remoteConfig = admin.remoteConfig();

module.exports = { admin, remoteConfig };