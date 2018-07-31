import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { AccountFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Transaction } from '../transaction';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';

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
  transactions: MatTableDataSource<Transaction>;
  displayedColumns: Array<string> = ["time", "description", "detail", "credit", "debit", "status"]
  addAmount: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


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
      this.transactions = new MatTableDataSource(transactions.filter(transaction=>transaction.uid == this.authService.getUid()));
      this.transactions.sort = this.sort;
      this.transactions.paginator = this.paginator;

      this.transactions.sort.start = "desc";

    });

  }
  
  
  addMoney(){
    this.transactionService.writeTransaction(this.authService.getUid(), "Deposit", "", parseFloat(this.addAmount), true);
    this.addAmount = "";
  }

}
