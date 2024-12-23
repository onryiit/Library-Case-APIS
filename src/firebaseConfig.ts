import * as admin from 'firebase-admin';

// Firebase Admin SDK'yı başlatıyoruz
const serviceAccount = require('/case-47376-firebase-adminsdk-j5opz-8647a02922.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://case-47376-default-rtdb.firebaseio.com/"
});

const db = admin.database();

export default db;