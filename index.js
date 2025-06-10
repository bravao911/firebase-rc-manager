// index.js
const app = require('./app'); // Import the configured Express app from app.js
const admin = require('firebase-admin'); // Assuming you have Firebase initialization here or in app.js
const path = require('path'); // For resolving serviceAccountKey.json path

// --- Firebase Admin SDK Initialization (if not already in app.js or config) ---
// IMPORTANT: Adjust path if serviceAccountKey.json is not in the project root.
// If your serviceAccountKey.json is in the project root (same level as index.js)
const serviceAccount = require('./serviceAccountKey.json');

// Ensure Firebase is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
// -----------------------------------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Firebase Remote Config API listening on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
    console.log('\n--- Example Endpoints ---');
    console.log('GET     /parameters');
    console.log('GET     /parameters/:key');
    console.log('GET     /parameters/:groupName/:key');
    console.log('POST    /parameters');
    console.log('DELETE  /parameters/:key');
    console.log('DELETE  /parameters/:groupName/:key');
    console.log('GET     /groups');
    console.log('GET     /groups/:groupName');
    console.log('POST    /groups');
    console.log('DELETE  /groups/:groupName');
});