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


    this.db.collection<AccountFace>("accounts").ref.get().then(snap=>{
       let filteredDocs = snap.docs.filter(doc=>doc.get("uid") == this.authService.getUid())
       
       let doc = null;
       if(filteredDocs.length > 0){
         doc = filteredDocs[0];
       }

       if(doc != null){
         let t = new Transaction();
         t.description = description;
         t.detail = detail;
         t.uid = uid;
         t.price = price;
         t.isDeposit = isDeposit;
         
         t.firstname = doc.get("firstname");
         t.lastname = doc.get("lastname");
         t.email = doc.get("email");
         t.accountid = "accounts/" + doc.id;
         
         let id = this.db.createId();
         t.id = "transactions/" + id;
         
         this.db.collection<Transaction>("transactions").doc(id).set(JSON.parse(JSON.stringify(t)));
       }

    });

    

  }

  updateTransaction(t: Transaction, data: any){
    this.db.doc(t.id).update(data);
  }


}
