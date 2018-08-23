import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { GridOptions } from 'ag-grid/main';
import { FormatterService } from './formatter.service';
import { DatePipe } from '@angular/common';
import { GridButtonGroupComponent } from '../gridElements/grid-button-group/grid-button-group.component';
import { GridStatusIconComponent } from '../gridElements/grid-status-icon/grid-status-icon.component';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transactionsSubscription: Subscription;
  allTransactions: Array<Transaction> = [];
  myTransactions: Array<Transaction> = [];
  unprocessedTransactions: Array<Transaction> = [];
  todayTransactions: Array<Transaction> = [];

  myTransactionsDS: MatTableDataSource<Transaction>;
  todayTransactionsDS: MatTableDataSource<Transaction>;

  numUnprocessed: number;

  public unprocessedGO: GridOptions;

  constructor(
    public authService: AuthService,
    public db: AngularFirestore,
    public formatterService: FormatterService
  ) {

    this.unprocessedGO = {
      
      getRowNodeId: (data) => data.time,
      onGridReady: (params) => {
        this.unprocessedGO.api = params.api;
        this.unprocessedGO.columnApi = params.columnApi;
        this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
        this.unprocessedGO.columnApi.autoSizeAllColumns();
      },
      rowHeight: 60,
      colWidth: 150,
      columnDefs: [
        { headerName: "Time", field: "time", 
          valueFormatter:(params) => {
            let pipe = new DatePipe("en-us");
            return pipe.transform(params.data.time, "short");
          }
        },
        { headerName: "Name", field: "displayName" },
        { headerName: "Description", field: "description" },
        { headerName: "Price", field: "price", editable: true, },
        {
          headerName: "Status",
          cellRendererFramework: GridStatusIconComponent,
          suppressAutoSize: true,
          width: 110
        },
        {
          headerName: "Control",
          cellRendererFramework: GridButtonGroupComponent,
          cellRendererParams: {transactionService: this, authService: authService},
          width: 280
        }
      ]

    }

  }

  subscribe() {

    console.log("TransactionService transactionsSubscription subscribing");
    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions => {
      this.allTransactions = transactions;

      this.unprocessedTransactions = transactions.filter(transaction => transaction.status != "done");
      if(this.unprocessedGO.api){
        this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
      }

      this.myTransactions = transactions.filter(transaction => transaction.uid == this.authService.getUid());
      this.numUnprocessed = this.unprocessedTransactions.length;

      this.todayTransactions = transactions.filter(transaction => {
        let today: Date = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);
        return new Date(transaction.time) >= today;
      });

      this.myTransactionsDS = new MatTableDataSource(this.myTransactions.sort((a, b) => a.time >= b.time ? -1 : 1));
      this.todayTransactionsDS = new MatTableDataSource(this.todayTransactions.sort((a, b) => a.time >= b.time ? -1 : 1))
    });

  }

  unsubscribe() {
    if (this.transactionsSubscription) {
      console.log("TransactionService transactionsSubscription unsubscribing");
      this.transactionsSubscription.unsubscribe();
    }

  }

  getRecentOrders(restaurant: string): Array<string> {
    let orders: Array<string> = [];
    this.myTransactions.filter(t => t.description == restaurant).forEach(t => {
      let food = t.detail.toLowerCase();
      if (orders.indexOf(food) === -1) {
        orders.push(food);
      }
    });
    return orders.slice(0, 3);
  }

  getPopularOrders(restaurant: string): Array<string> {
    let d: any = {};
    this.allTransactions.filter(t => t.description == restaurant).forEach(t => {
      if (d[t.detail.toLowerCase()]) {
        d[t.detail.toLowerCase()] = d[t.detail.toLowerCase()] + 1
      }
      else {
        d[t.detail.toLowerCase()] = 1
      }
    });

    let orders: Array<any> = Object.keys(d).map(key => {
      return { "name": key, "n": d[key] }
    }).sort((a, b) => a.n >= b.n ? -1 : 1);

    return orders.map(x => x.name).slice(0, 5);
  }

  writeTransaction(uid: string, description: string, detail: string, price: number, isDeposit: boolean) {

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

  updateTransaction(t: Transaction, data: any) {
    this.db.doc(t.id).update(data);
  }

  cancelTransaction(t: Transaction) {
    this.db.doc(t.id).delete();
  }


}
