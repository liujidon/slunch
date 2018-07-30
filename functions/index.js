// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});


// Listen for updates to any `transactions` document.
exports.updateAccountBalance = functions.firestore
    .document('transactions/{transactionId}')
    .onUpdate((change, context) => {
      // Retrieve the current transaction 
      const transaction = change.after.data();
      const previousTransaction = change.before.data();
      console.log("Transaction update: ", transaction);

      let processed = transaction.processed;
      if (processed == null || !processed || transaction.accountid == null)
        return;
      if(transaction.price == previousTransaction.price)
        return;
      let account = admin.firestore().ref(transaction.accountid);
      return account.get().then(doc => {
          return doc.balance - transaction.price;
      }).then(newbalance => {
          account.update({
              balance: newbalance,
          }).then(() => {
            console.log("Balance updated to %.2f for %s", newbalance, transaction.accountid);
          });
      });
    });