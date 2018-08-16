import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { Transaction } from '../transaction';
import { MatPaginator, MatSort } from '@angular/material';
import { AdminService } from '../providers/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  price: string;
  unprocessedColumns: Array<string> = [
    "time", "name", "description", "detail", 
    "price", "status", "acknowledge", "ordered", "confirm"
  ];
  accountsColumns: Array<string> = [
    "email", "balance", "name"
  ]
  todayColumns: Array<string> = [
    "time", "name", "description", "detail", "debit", "credit"
  ]

  @ViewChild("unprocessedPaginator") unprocessedPaginator: MatPaginator;
  @ViewChild("accountPaginator") accountPaginator: MatPaginator;
  @ViewChild("todayPaginator") todayPaginator: MatPaginator;
  @ViewChild("todaySort") todaySort: MatSort;

  constructor(
    public transactionService: TransactionService,
    public stateService: StateService,
    public authService: AuthService,
    public router: Router,
    public adminService: AdminService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    if(this.transactionService.unprocessedTransactionsDS){
      this.transactionService.unprocessedTransactionsDS.paginator = this.unprocessedPaginator;
    }
    if(this.adminService.accountsDS){
      this.adminService.accountsDS.paginator = this.accountPaginator;
    }
    if(this.transactionService.todayTransactionsDS){
      this.transactionService.todayTransactionsDS.paginator = this.todayPaginator;
      this.transactionService.todayTransactionsDS.sort = this.todaySort;
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

  getTotalDebit(){
    if(this.transactionService.todayTransactions){
      return this.transactionService.todayTransactions.filter(t=>t.price>=0).map(t=>t.price).reduce((acc,v)=>acc+v,0);
    }
    else{
      return 0;
    }
  }

  getTotalCredit(){
    if(this.transactionService.todayTransactions){
      return this.transactionService.todayTransactions.filter(t=>t.price<0).map(t=>t.price).reduce((acc,v)=>acc+v,0);
    }
    else{
      return 0;
    }
  }

  getTodayPosition(){
    if(this.transactionService.todayTransactions){
      return -1*this.transactionService.todayTransactions.map(t=>t.price).reduce((acc,v)=>acc+v,0);
    }
    else{
      return 0;
    }
  }

  getTotalBalance(){
    if(this.adminService.accounts){
      return this.adminService.accounts.map(a=>a.balance).reduce((acc,v)=>acc+v,0);
    }
    else{
      return 0;
    }
  }



}
