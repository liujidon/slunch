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
            if (previousTransaction.status === transaction.status) {
                spending = transaction.price - previousTransaction.price;
            }
            else {
                spending = transaction.price;
            }

            let newBalance = doc.data().balance - spending;
            console.log("New balance: ", newBalance);
            return account.update({
                balance: newBalance
            });
        });
    });

exports.updateVoteStatus = functions.firestore
    .document('poll/{pollId}')
    .onCreate((snap, context) => {
        return admin.firestore().collection('accounts').get().then(querySnapshot => {
            return querySnapshot.forEach(documentSnapshot => {
                let account = admin.firestore().collection('accounts').doc(documentSnapshot.id);
                return account.update({
                    voteStatus: "Not Voted",
                    latestVotes: []
                });
            });
        });
    });

// exports.addCreditDebit = functions.firestore
//     .document('poll/{pollId}')
//     .onCreate((snap, context) => {
//         return admin.firestore().collection('transactions').get().then(querySnapshot => {
//             let lst = {}
//             return querySnapshot.forEach(documentSnapshot => {
//                 let account = admin.firestore().doc(documentSnapshot.data().accountid);
//                 let accountid = documentSnapshot.data().accountid
//                 if (!(documentSnapshot.data().accountid in lst)){
//                     lst[accountid] = {credit: 0, debit: 0}
//                 }
//                 let price = documentSnapshot.data().price
//                 if (documentSnapshot.data().status === "done") {
//                     if (documentSnapshot.data().isDeposit) {
//                         price = -1 * price
//                         lst[accountid].credit += price
//                     }
//                     else {
//                         lst[accountid].debit += price;
//                     }
//                 }
//                 return account.update(lst[accountid]);
//             });
//         });
//     });

// exports.resetCreditDebit = functions.firestore
//     .document('poll/{pollId}')
//     .onCreate((snap, context) => {
//         return admin.firestore().collection('accounts').get().then(querySnapshot => {
//             return querySnapshot.forEach(documentSnapshot => {
//                 let account = admin.firestore().collection('accounts').doc(documentSnapshot.id);
//                     return account.update({
//                         credit: 0,
//                         debit: 0
//                     });
//             });
//         });
//     });


exports.setupNewUser = functions.auth.user().onCreate((user) => {
    console.log("Setting up new user: ", user);
    let firstname = "";
    let lastname = "";

    firstname = user.email.split("@")[0];

    if (user.displayName !== null) {
        let splitName = user.displayName.split(' ');
        if (splitName.length > 0)
            firstname = splitName[0];
        if (splitName.length > 1)
            lastname = splitName[1];
    }
    var account = {
        balance: 0,
        email: user.email,
        uid: user.uid,
        firstname: firstname,
        lastname: lastname,
        latestVotes: [],
        voteStatus: "Not Voted",
        credit: 0,
        debit: 0
    };
    return admin.firestore().collection('accounts').add(account);
});
