import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { AccountFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Transaction } from '../transaction';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

  authService: AuthService;
  transactionService: TransactionService;
  account: AccountFace;
  db: AngularFirestore;
  transactions: MatTableDataSource<Transaction>;
  displayedColumns: Array<string> = ["time", "description", "detail", "debit", "credit", "status"]
  addAmount: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  accountsSubscription: Subscription;
  transactionsSubscription: Subscription;


  constructor(db: AngularFirestore, authService: AuthService, transactionService: TransactionService) {
    this.authService = authService;
    this.transactionService = transactionService;
    this.db = db;
  }

  ngOnInit() {

    this.accountsSubscription = this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      docChangeActions => {
        
        let temp = docChangeActions.filter(docChangeAction => docChangeAction.payload.doc.get("uid") == this.authService.getUid())
        if(temp.length > 0){
          this.account = temp[0].payload.doc.data();
        }
      }, ()=>console.log("ERROR: AccountComponent line 35")
    );

    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions=>{
      this.transactions = new MatTableDataSource(transactions.filter(transaction=>transaction.uid == this.authService.getUid()));
      this.transactions.sort = this.sort;
      this.transactions.paginator = this.paginator;
      
      if(this.sort.sortables.get("time")){
        this.sort.start = "desc";
        this.sort.disableClear = true;
        if(this.sort.direction != "desc"){
          this.sort.sort(this.sort.sortables.get("time"));
        }
      }
    }, ()=>console.log("ERROR: TransactionsComponent line 43"));

  }

  ngOnDestroy(){
    console.log("AccountComponent unsubscribing");
    this.accountsSubscription.unsubscribe();
    this.transactionsSubscription.unsubscribe();
  }
  
  
  addMoney(){
    this.transactionService.writeTransaction(this.authService.getUid(), "Deposit", "", parseFloat(this.addAmount), true);
    this.addAmount = "";
  }

}
