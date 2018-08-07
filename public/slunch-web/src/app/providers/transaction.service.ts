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
   
  }

  getTransactions$(){
      return this.db.collection<Transaction>("transactions").valueChanges();
  }

  writeTransaction(uid: string, description: string, detail: string,  price: number, isDeposit: boolean){

    this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      (docChangeActions) => {
        let temp = docChangeActions.filter(docChangeAction => docChangeAction.payload.doc.get("uid") == this.authService.getUid())
        if(temp.length > 0){
          let accountDoc = temp[0].payload.doc;
          let account = accountDoc.data();
          let t = new Transaction();
    
          t.description = description;
          t.detail = detail;
          t.firstname = account.firstname;
          t.lastname = account.lastname;
          t.email = account.email;
          t.accountid = "accounts/" + accountDoc.id;
          t.uid = uid;
          t.price = price;
          t.isDeposit = isDeposit;

          let id = this.db.createId();
          t.id = "transactions/" + id;

          this.db.collection<Transaction>("transactions").doc(id).set(JSON.parse(JSON.stringify(t)));

        }
      }, ()=>console.log("ERROR: TransactionService line 22")
    );



    

  }

  updateTransaction(t: Transaction, data: any){
    this.db.doc(t.id).update(data);
  }


}
