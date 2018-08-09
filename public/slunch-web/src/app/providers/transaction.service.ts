import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { AccountFace } from '../interfaces';
import { Subscription } from 'rxjs';
import { } from 'rxjs/add/observable/empty'
import { MatTableDataSource } from '../../../node_modules/@angular/material';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  authService: AuthService;
  db: AngularFirestore;

  transactionsSubscription: Subscription;
  allTransactions: Array<Transaction>;
  myTransactions: Array<Transaction>;
  unprocessedTransactions: Array<Transaction>;
  myTransactionsDS: MatTableDataSource<Transaction>;
  unprocessedTransactionsDS: MatTableDataSource<Transaction>;
  numUnprocessed: number;

  constructor(authService: AuthService, db: AngularFirestore) {
    this.authService = authService;
    this.db = db;
   
  }

  subscribe(){

    console.log("TransactionService transactionsSubscription subscribing");
    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions=>{
      this.allTransactions = transactions;
      this.unprocessedTransactions = transactions.filter(transaction=>transaction.status != "done");
      this.myTransactions = transactions.filter(transaction=>transaction.uid == this.authService.getUid());
      this.numUnprocessed = this.unprocessedTransactions.length;

      this.unprocessedTransactionsDS = new MatTableDataSource(this.unprocessedTransactions.sort((a,b)=>a.time>=b.time?-1:1));
      this.myTransactionsDS = new MatTableDataSource(this.myTransactions.sort((a,b)=>a.time>=b.time?-1:1));
    });

  }

  unsubscribe(){
    if(this.transactionsSubscription){
      console.log("TransactionService transactionsSubscription unsubscribing");
      this.transactionsSubscription.unsubscribe();
    }

  }

  getRecentOrders(restaurant:string):Array<string>{
    let orders:Array<string> = [];
    this.myTransactions.filter(t=>t.description == restaurant).forEach(t=>{
      if(orders.indexOf(t.detail) === -1){
        orders.push(t.detail);
      }
    });
    return orders;
  }



  writeTransaction(uid: string, description: string, detail: string,  price: number, isDeposit: boolean){

    let t = new Transaction();
    t.description = description;
    t.detail = detail;
    t.uid = uid;
    t.price = price;
    t.isDeposit = isDeposit;
    t.displayName = this.authService.getUsername();
    
    let account = this.authService.account;
    t.email = account.email;
    t.accountid = "accounts/" + account.id;
    
    let id = this.db.createId();
    t.id = "transactions/" + id;
    this.db.collection<Transaction>("transactions").doc(id).set(JSON.parse(JSON.stringify(t)));

  }

  updateTransaction(t: Transaction, data: any){
    this.db.doc(t.id).update(data);
  }


}
