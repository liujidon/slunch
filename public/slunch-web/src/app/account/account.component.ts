import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { TransactionService } from '../providers/transaction.service';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  authService: AuthService;
  transactionService: TransactionService;
  db: AngularFirestore;
  
  displayedColumns: Array<string> = ["time", "description", "detail", "debit", "credit", "status"]
  addAmount: string;

  constructor(db: AngularFirestore, authService: AuthService, transactionService: TransactionService) {
    this.authService = authService;
    this.transactionService = transactionService;
    this.db = db;
  }

  ngOnInit() {

  }
  
  
  addMoney(){
    this.transactionService.writeTransaction(this.authService.getUid(), "Deposit", "", parseFloat(this.addAmount), true);
    this.addAmount = "";
  }

}
