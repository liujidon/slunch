import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { AccountFace } from '../interfaces';
import { Observable } from 'rxjs';
import { timeout } from '../../../node_modules/@types/q';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  authService: AuthService;
  db: AngularFirestore;
  accounts: any;

  constructor(authService: AuthService, db: AngularFirestore) {
    this.authService = authService;
    this.db = db;

    this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      (docChangeActions) => {
        this.accounts = {};
        docChangeActions.forEach((docChangeAction)=>{
          let accountDoc = docChangeAction.payload.doc;
          let account = accountDoc.data();
          account["id"] = "accounts/" + accountDoc.id;
          this.accounts[accountDoc.get("uid")] = account;
        });
      }
    );
   
  }

  getTransactions$(){
    return this.db.collection<Transaction>("transactions", ref=>ref.orderBy("time", "desc")).valueChanges();
  }

  writeTransaction(uid: string, order: string, restaurant: string, price: number){
    let t = new Transaction();
    t.order = order;
    t.restaurant = restaurant;
    
    let account = this.accounts[uid];
    t.firstname = account.firstname;
    t.lastname = account.lastname;
    t.email = account.email;
    t.accountid = account.id;
    t.uid = uid;
    t.price = price;

    let id = this.db.createId();
    t.id = "transactions/" + id;

    this.db.collection<Transaction>("transactions").doc(id).set(JSON.parse(JSON.stringify(t)));

  }

  updateTransaction(t: Transaction, data: any){
    this.db.doc(t.id).update(data);
  }


}
