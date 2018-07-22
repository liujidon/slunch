const admin = require('firebase-admin');
var serviceAccount = require('./accountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const settings = { timestampsInSnapshots: true};
var db = admin.firestore();
db.settings(settings);
//
// var docRef = db.collection('users').doc('alovelace');
//
// var setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

db.collection('accounts').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
