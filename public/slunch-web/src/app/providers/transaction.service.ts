import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid/main';
import { FormatterService } from './formatter.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { GridControlStatusComponent } from '../gridElements/grid-control-status/grid-control-status.component';
import { GridStatusComponent } from '../gridElements/grid-status/grid-status.component';
import { GridCancelTransactionComponent } from '../gridElements/grid-cancel-transaction/grid-cancel-transaction.component';
import { GridUpdateTransactionComponent } from '../gridElements/grid-update-transaction/grid-update-transaction.component';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transactionsSubscription: Subscription;
  allTransactions: Array<Transaction> = [];
  myTransactions: Array<Transaction> = [];
  unprocessedTransactions: Array<Transaction> = [];
  todayTransactions: Array<Transaction> = [];

  numUnprocessed: number;

  public unprocessedGO: GridOptions;
  public todayGO: GridOptions;
  public myGO: GridOptions;

  constructor(
    public authService: AuthService,
    public db: AngularFirestore,
    public formatterService: FormatterService
  ) {

    this.unprocessedGO = {
      onGridReady: (params) => {
        this.unprocessedGO.api = params.api;
        this.unprocessedGO.columnApi = params.columnApi;
        this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
        this.unprocessedGO.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      colWidth: 150,
      columnDefs: [
        { headerName: "Time", field: "time", 
          valueFormatter:(params) => {
            let pipe = new DatePipe("en-us");
            return pipe.transform(params.data.time, "short");
          }, sort:"desc"
        },
        { headerName: "Name", field: "displayName" },
        { headerName: "Description", field: "description" },
        { headerName: "Price", field: "price", editable: true, valueFormatter:(params)=>{
          let pipe = new CurrencyPipe("en-us");
          return pipe.transform(params.value);
        }},
        {
          headerName: "Status",
          cellRendererFramework: GridStatusComponent,
          width: 110
        },
        {
          headerName: "Control",
          cellRendererFramework: GridControlStatusComponent,
          cellRendererParams: {transactionService: this, authService: authService},
          width: 280
        }
      ],
      animateRows: true,
      sortingOrder:["desc", "asc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }

    this.todayGO = {
      onGridReady: (params)=>{
        this.todayGO.api = params.api;
        this.todayGO.columnApi = params.columnApi;
        this.todayGO.api.setRowData(this.todayTransactions);
        this.todayGO.api.sizeColumnsToFit();
      },
      columnDefs: [
        { headerName: "Time", field: "time", valueFormatter:(params)=>{
          let pipe = new DatePipe("en-us");
          return pipe.transform(params.data.time, "short");
        }, sort:"desc"},
        { headerName: "Name", field: "displayName"},
        { headerName: "Description", field: "description"},
        { headerName: "Detail", field: "detail"},
        { headerName: "Money", field: "price", valueFormatter:(params)=>{
          let pipe = new CurrencyPipe("en-us");
          if(params.value < 0) return pipe.transform(-params.value);
          else return pipe.transform(params.value);
        }, cellClass:(params)=>{
          if(params.value >= 0) return 'red';
          else return 'green';
        }, editable: true},
        { 
          headerName: "Update", 
          cellRendererFramework: GridUpdateTransactionComponent,
          cellRendererParams: {transactionService: this}
        }
      ],
      animateRows: true,
      sortingOrder:["desc", "asc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }

    this.myGO = {
      onGridReady: (params)=>{
        this.myGO.api = params.api;
        this.myGO.columnApi = params.columnApi;
        this.myGO.api.setRowData(this.myTransactions);
        this.myGO.api.sizeColumnsToFit();
      },
      columnDefs: [
        {headerName: "Time", field:"time", valueFormatter:(params)=>{
          let pipe = new DatePipe('en-us');
          return pipe.transform(params.value, "short");
        }, sort:"desc"},
        {headerName: "Description", field:"description"},
        {headerName: "Detail", field:"detail"},
        {headerName: "Debit", field:"price", valueFormatter:(params)=>{
          let pipe = new CurrencyPipe("en-us");
          if(params.value >= 0) return pipe.transform(params.value);
          else return "";
        }, cellClass:["red"]},
        {headerName:"Credit", field:"price", valueFormatter:(params)=>{
          let pipe = new CurrencyPipe("en-us");
          if(params.value < 0) return pipe.transform(-params.value);
          else return "";
        }, cellClass:["green"]},
        {headerName: "Status", cellRendererFramework: GridStatusComponent},
        {
          headerName: "Cancel",
          cellRendererFramework: GridCancelTransactionComponent,
          cellRendererParams: {transactionService: this}
        }
      ],
      animateRows: true,
      sortingOrder:["desc", "asc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }



  }

  subscribe() {

    console.log("TransactionService transactionsSubscription subscribing");
    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions => {
      this.allTransactions = transactions.sort((a, b) => a.time >= b.time ? -1 : 1);

      this.unprocessedTransactions = transactions.filter(transaction => transaction.status != "done");
      if(this.unprocessedGO.api) this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
      this.numUnprocessed = this.unprocessedTransactions.length;

      this.todayTransactions = transactions.filter(transaction => {
        let today: Date = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);
        return new Date(transaction.time) >= today;
      });
      if(this.todayGO.api) this.todayGO.api.setRowData(this.todayTransactions);

      this.myTransactions = transactions.filter(transaction => transaction.uid == this.authService.getUid());
      if(this.myGO.api) this.myGO.api.setRowData(this.myTransactions)

      

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
