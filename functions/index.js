// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Listen for updates to any `transactions` document.
exports.updateAccountBalance = functions.firestore
  .document('transactions/{transactionId}')
  .onUpdate((change, context) => {
    const transaction = change.after.data();
    const previousTransaction = change.before.data();
    console.log("Transaction update: ", transaction);

    let status = transaction.status;
    if (status === null || status !== "done" || transaction.accountid === null)
      return null;
    if (transaction.price === previousTransaction.price)
      return null;

    console.log("Updating account: ", transaction.accountid);
    let account = admin.firestore().doc(transaction.accountid);

    return account.get().then(doc => {
      let spending = 0;
      if(previousTransaction.status === transaction.status){
        spending = transaction.price - previousTransaction.price;
      }
      else{
        spending = transaction.price;
      }

      let newBalance = doc.data().balance - spending;
      console.log("New balance: ", newBalance);
      return account.update({
        balance: newBalance
      });
    });
  });
