import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { AccountFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  authService: AuthService;
  transactionService: TransactionService;
  account: AccountFace;
  db: AngularFirestore;
  orders: Array<Transaction>;
  displayedColumns: Array<string> = ["time", "restaurant", "order", "price", "processed"]
  addAmount: string;


  constructor(db: AngularFirestore, authService: AuthService, transactionService: TransactionService) {
    this.authService = authService;
    this.transactionService = transactionService;
    this.db = db;
  }

  ngOnInit() {

    this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      (docChangeActions) => {
        let accounts = {};
        docChangeActions.forEach((docChangeAction)=>{
          let accountDoc = docChangeAction.payload.doc;
          let account = accountDoc.data();
          account["id"] = "accounts/" + accountDoc.id;
          accounts[accountDoc.get("uid")] = account;
        });
        this.account = accounts[this.authService.getUid()];
      }
    );

    this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions=>{
      this.orders = transactions.filter(transaction=>transaction.uid == this.authService.getUid());
    });

  }
  
  
  addMoney(){
    this.transactionService.writeTransaction(this.authService.getUid(), "", "", -parseFloat(this.addAmount));
    this.addAmount = "";
  }

}
