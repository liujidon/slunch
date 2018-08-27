import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { Subscription } from 'rxjs';
import { GridOptions, CsvExportParams } from 'ag-grid';
import { FormatterService } from './formatter.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { GridControlStatusComponent } from '../gridElements/grid-control-status/grid-control-status.component';
import { GridStatusComponent } from '../gridElements/grid-status/grid-status.component';
import { GridCancelTransactionComponent } from '../gridElements/grid-cancel-transaction/grid-cancel-transaction.component';
import { GridConfirmTransactionComponent } from '../gridElements/grid-confirm-transaction/grid-confirm-transaction.component';
import { MatBottomSheet } from '@angular/material';

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
  numUnprocessedOrders: number;

  public unprocessedGO: GridOptions;
  public allGO: GridOptions;
  public myGO: GridOptions;

  constructor(
    public authService: AuthService,
    public db: AngularFirestore,
    public formatterService: FormatterService,
    public bottomSheetService: MatBottomSheet
  ) {

    this.unprocessedGO = {
      onGridReady: (params) => {
        this.unprocessedGO.api = params.api;
        this.unprocessedGO.columnApi = params.columnApi;
        this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
        this.unprocessedGO.columnApi.autoSizeAllColumns();
      },
      columnDefs: [
        {
          headerName: "Time", field: "time",
          valueFormatter: (params) => {
            let pipe = new DatePipe("en-us");
            return pipe.transform(params.data.time, "short");
          }, sort: "desc",
          sortingOrder: ["desc", "asc"],
          suppressFilter: true,
          suppressResize: true
        },
        {
          headerName: "Name", field: "displayName", suppressFilter: true,
          sortingOrder: ["asc", "desc", null]
        },
        {
          headerName: "Description", field: "description",
          sortingOrder: ["asc", "desc", null], suppressFilter: true

        },
        {
          headerName: "Detail", field: "detail",
          sortingOrder: ["asc", "desc", null],
          suppressFilter: true,
          suppressSorting: true
        },
        {
          cellRendererFramework: GridStatusComponent,
          suppressSorting: true, suppressFilter: true, suppressResize: true
        },
        {
          headerName: "Status",
          cellRendererFramework: GridControlStatusComponent,
          cellRendererParams: { transactionService: this, authService: authService },
          suppressSorting: true, suppressFilter: true, suppressResize: true
        },
        {
          headerName: "Confirm Transaction",
          cellRendererFramework: GridConfirmTransactionComponent,
          cellRendererParams: {
            transactionService: this,
            authService: authService,
            bottomSheetService: bottomSheetService,
            caption: "Confirm"
          },
          suppressSorting: true, suppressFilter: true, suppressResize: true
        }
      ],
      animateRows: true,
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowHeight: 40,
    }

    this.allGO = {
      onGridReady: (params) => {
        this.allGO.api = params.api;
        this.allGO.columnApi = params.columnApi;
        this.allGO.api.setRowData(this.allTransactions);
        this.allGO.columnApi.autoSizeAllColumns();
      },
      columnDefs: [
        {
          headerName: "Time", field: "time", valueFormatter: (params) => {
            let pipe = new DatePipe("en-us");
            return pipe.transform(params.data.time, "short");
          },
          sort: "desc",
          filter: "agDateColumnFilter",
          filterValueGetter: (params) => new Date(params.data.time)
        },
        { headerName: "Name", field: "displayName" },
        { headerName: "Description", field: "description" },
        { headerName: "Detail", field: "detail" },
        {
          headerName: "Money", field: "price", valueFormatter: (params) => {
            let pipe = new CurrencyPipe("en-us");
            if (params.value < 0) return pipe.transform(-params.value);
            else return pipe.transform(params.value);
          }, cellClass: (params) => {
            if (params.value >= 0) return 'red';
            else return 'green';
          }, editable: true
        },
        {
          headerName: "Confirm Transaction",
          cellRendererFramework: GridConfirmTransactionComponent,
          cellRendererParams: {
            transactionService: this,
            authService: authService,
            bottomSheetService: bottomSheetService,
            caption: "Edit"
          },
          suppressSorting: true, suppressFilter: true, suppressResize: true
        }
      ],
      animateRows: true,
      sortingOrder: ["desc", "asc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowHeight: 40
    }

    this.myGO = {
      onGridReady: (params) => {
        this.myGO.api = params.api;
        this.myGO.columnApi = params.columnApi;
        this.myGO.api.setRowData(this.myTransactions);
        this.myGO.columnApi.autoSizeAllColumns();
      },
      columnDefs: [
        {
          headerName: "Time", field: "time", valueFormatter: (params) => {
            let pipe = new DatePipe('en-us');
            return pipe.transform(params.value, "short");
          }, sort: "desc"
        },
        { headerName: "Description", field: "description" },
        { headerName: "Detail", field: "detail" },
        {
          headerName: "Debit", field: "price", valueFormatter: (params) => {
            let pipe = new CurrencyPipe("en-us");
            if (params.value >= 0) return pipe.transform(params.value);
            else return "";
          }, cellClass: ["red"]
        },
        {
          headerName: "Credit", field: "price", valueFormatter: (params) => {
            let pipe = new CurrencyPipe("en-us");
            if (params.value < 0) return pipe.transform(-params.value);
            else return "";
          }, cellClass: ["green"]
        },
        { headerName: "Status", cellRendererFramework: GridStatusComponent },
        {
          headerName: "Cancel",
          cellRendererFramework: GridCancelTransactionComponent,
          cellRendererParams: { transactionService: this }
        }
      ],
      animateRows: true,
      sortingOrder: ["desc", "asc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }

  }

  exportUnprocessed() {

    let pipe = new DatePipe("en-us");
    let filename = "ORDERS_" + pipe.transform(new Date().toString(), "yyyyMMdd_HHmm")

    let params: CsvExportParams = {
      columnKeys: ["displayName", "description", "detail"],
      fileName: filename,
      shouldRowBeSkipped: (params) => params.node.data.isDeposit,
      skipHeader: true
    }

    this.unprocessedGO.api.exportDataAsCsv(params);
  }

  subscribe() {

    console.log("TransactionService transactionsSubscription subscribing");
    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions => {
      this.allTransactions = transactions.filter(transaction => transaction.status == "done");
      if (this.allGO.api) this.allGO.api.setRowData(this.allTransactions);

      this.unprocessedTransactions = transactions.filter(transaction => transaction.status != "done");
      if (this.unprocessedGO.api) this.unprocessedGO.api.setRowData(this.unprocessedTransactions);
      this.numUnprocessed = this.unprocessedTransactions.length;

      this.numUnprocessedOrders = this.unprocessedTransactions.filter(transaction => !transaction.isDeposit).length;

      this.todayTransactions = transactions.filter(transaction => {
        let today: Date = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);
        return new Date(transaction.time) >= today;
      });


      this.myTransactions = transactions.filter(transaction => transaction.uid == this.authService.getUid());
      if (this.myGO.api) this.myGO.api.setRowData(this.myTransactions)



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
