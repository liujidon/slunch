import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../providers/auth.service';
import {TransactionService} from '../providers/transaction.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {HostListener} from '@angular/core';
import {AccountService} from '../providers/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

  authService: AuthService;
  transactionService: TransactionService;
  accountService: AccountService;
  db: AngularFirestore;
  screenWidth: number = window.innerWidth;

  addAmount: any;

  constructor(db: AngularFirestore, authService: AuthService, transactionService: TransactionService, accountService: AccountService) {
    this.authService = authService;
    this.transactionService = transactionService;
    this.accountService = accountService;
    this.db = db;
  }

  ngOnInit() {
    this.accountService.subscribe();
  }

  ngOnDestroy() {
    this.accountService.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if (window.innerWidth < 480) {
      this.accountService.myGO.columnApi.autoSizeAllColumns();
    }
    else {
      this.accountService.myGO.api.sizeColumnsToFit();
    }
  }


  addMoney() {
    this.transactionService.writeTransaction(this.authService.getUid(), "Deposit", "", this.addAmount, true);
    this.addAmount = "";
  }

  setDate(event) {
    this.accountService.setDateLB(new Date(event.value));
  }

}
