import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { Transaction } from '../transaction';
import { MatPaginator } from '@angular/material';
import { AdminService } from '../providers/admin.service';
import { totalmem } from 'os';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  price: string;
  transactionColumns: Array<string> = [
    "time", "name", "description", "detail", 
    "price", "status", "acknowledge", "ordered", "confirm"
  ];
  accountsColumns: Array<string> = [
    "email", "balance", "name"
  ]

  @ViewChild("transactionPaginator") transactionPaginator: MatPaginator;
  @ViewChild("accountPaginator") accountPaginator: MatPaginator;

  constructor(
    public transactionService: TransactionService,
    public stateService: StateService,
    public authService: AuthService,
    public router: Router,
    public adminService: AdminService
  ) { }

  ngOnInit() {
    if(this.transactionService.unprocessedTransactionsDS){
      this.transactionService.unprocessedTransactionsDS.paginator = this.transactionPaginator;
    }
    if(this.adminService.accountsDS){
      this.adminService.accountsDS.paginator = this.accountPaginator;
    }
  }

  confirmTransaction(t: Transaction){
    let p: any = t.price;
    if(t.isDeposit){
      p = -parseFloat(p);
    }
    else{
      p = parseFloat(p);
    }
    let data = {
      status: "done",
      price: p,
      completedBy: this.authService.getUsername()
    };
    this.transactionService.updateTransaction(t, data);
  }

  confirmOrdered(t: Transaction){
    let data = {
      status: "ordered",
      orderedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

  acknowledgeTransaction(t: Transaction){
    let data = {
      status: "ack",
      ackedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

  getTotalBalance(){
    if(this.adminService.accounts){
      return this.adminService.accounts.map(account => account.balance).reduce((total, balance) => total + balance, 0);
    }
    else{
      return 0;
    }
    
  }

}
