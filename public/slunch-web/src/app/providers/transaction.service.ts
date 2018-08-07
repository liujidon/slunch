import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { AccountFace } from '../interfaces';
import { Observable } from 'rxjs';
import { } from 'rxjs/add/observable/empty'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  authService: AuthService;
  db: AngularFirestore;
  account: any;

  constructor(authService: AuthService, db: AngularFirestore) {
    this.authService = authService;
    this.db = db;

    this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      (docChangeActions) => {
        let accountQ: QueryDocumentSnapshot<AccountFace> = docChangeActions
          .filter(docChangeAction => docChangeAction.payload.doc.get("uid") == this.authService.getUid())[0]
          .payload.doc;
        this.account = accountQ.data();
        this.account["id"] = accountQ.id;
      }, ()=>console.log("ERROR: TransactionService line 22")
    );
   
  }

  getTransactions$(){
      return this.db.collection<Transaction>("transactions").valueChanges();
  }

  writeTransaction(uid: string, description: string, detail: string,  price: number, isDeposit: boolean){
    let t = new Transaction();
    
    t.description = description;
    t.detail = detail;

    let account = this.account;
    t.firstname = account.firstname;
    t.lastname = account.lastname;
    t.email = account.email;
    t.accountid = "accounts/" + account.id;
    t.uid = uid;
    t.price = price;
    t.isDeposit = isDeposit;

    let id = this.db.createId();
    t.id = "transactions/" + id;

    this.db.collection<Transaction>("transactions").doc(id).set(JSON.parse(JSON.stringify(t)));

  }

  updateTransaction(t: Transaction, data: any){
    this.db.doc(t.id).update(data);
  }


}
