import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { TransactionService } from '../providers/transaction.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  authService: AuthService;
  transactionService: TransactionService;
  db: AngularFirestore;
  screenWidth: number = window.innerWidth;

  addAmount: any;

  constructor(db: AngularFirestore, authService: AuthService, transactionService: TransactionService) {
    this.authService = authService;
    this.transactionService = transactionService;
    this.db = db;
  }

  ngOnInit() {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if(window.innerWidth < 480) {
      this.transactionService.myGO.columnApi.autoSizeAllColumns();
    }
    else {
      this.transactionService.myGO.api.sizeColumnsToFit();
    }
  }


  addMoney(){
    this.transactionService.writeTransaction(this.authService.getUid(), "Deposit", "", this.addAmount, true);
    this.addAmount = "";
  }

  setDate(event){
    this.transactionService.setDateLB(new Date(event.value));
  }

}
