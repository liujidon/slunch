import {Injectable, Pipe} from '@angular/core';
import {AuthService} from './auth.service';
import {PollService} from './poll.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {Transaction} from '../transaction';
import {Subscription, Operator, Observable,} from 'rxjs';
import {GridOptions, CsvExportParams} from 'ag-grid';
import {FormatterService} from './formatter.service';
import {DatePipe, CurrencyPipe} from '@angular/common';
import {GridControlStatusComponent} from '../gridElements/grid-control-status/grid-control-status.component';
import {GridStatusComponent} from '../gridElements/grid-status/grid-status.component';
import {GridCancelTransactionComponent} from '../gridElements/grid-cancel-transaction/grid-cancel-transaction.component';
import {GridCancelTransactionAdminComponent} from '../gridElements/grid-cancel-transaction-admin/grid-cancel-transaction-admin.component';
import {GridConfirmTransactionComponent} from '../gridElements/grid-confirm-transaction/grid-confirm-transaction.component';
import {MatBottomSheet} from '@angular/material';
import {environment} from '../../environments/environment';
import {StateFace} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transactionsSubscription: Subscription;
  allTransactions: Array<Transaction> = [];
  doneTransactions: Array<Transaction> = [];
  myTransactions: Array<Transaction> = [];
  unprocessedTransactions: Array<Transaction> = [];
  unprocessedOrders: Array<Transaction> = [];
  todayTransactions: Array<Transaction> = [];

  stateSubscription: Subscription;

  dateLB: Date;
  initFlag: boolean = true;

  todayPosition: number = 0;
  myDebit: number = 0;
  myCredit: number = 0;
  numUnprocessed: number;
  numUnprocessedOrders: number;

  public unprocessedGO: GridOptions;
  public doneGO: GridOptions;
  public myGO: GridOptions;


  constructor(public authService: AuthService,
              public pollService: PollService,
              public db: AngularFirestore,
              public formatterService: FormatterService,
              public bottomSheetService: MatBottomSheet) {

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
          suppressSorting: true, suppressFilter: true
        },
        {
          headerName: "Status",
          cellRendererFramework: GridControlStatusComponent,
          field: 'statusButton',
          cellRendererParams: {transactionService: this, authService: authService},
          suppressSorting: true, suppressFilter: true
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
          suppressSorting: true, suppressFilter: true, width: 190
        },
        {
          cellRendererFramework: GridCancelTransactionAdminComponent,
          cellRendererParams: {
            transactionService: this,
            caption: "Cancel Transaction"
          },
          cellStyle: {textAlign: "center"},
          suppressSorting: true, suppressFilter: true
        }
      ],
      animateRows: true,
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowHeight: 40,
    }

    this.doneGO = {
      onGridReady: (params) => {
        this.doneGO.api = params.api;
        this.doneGO.columnApi = params.columnApi;
        this.doneGO.api.setRowData(this.doneTransactions);
        if (window.innerWidth < 480) {
          this.doneGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.doneGO.api.sizeColumnsToFit();
        }
      },
      columnDefs: [
        {
          headerName: "Time", field: "time", valueFormatter: (params) => {
          let pipe = new DatePipe("en-us");
          return pipe.transform(params.data.time, "short");
        },
          sort: "desc",
          filter: "agDateColumnFilter",
          filterValueGetter: (params) => new Date(params.data.time),
          sortingOrder: ["desc", "asc"]
        },
        {headerName: "Name", field: "displayName"},
        {headerName: "Description", field: "description"},
        {headerName: "Detail", field: "detail", suppressSorting: true},
        {
          headerName: "Money", field: "price", valueFormatter: (params) => {
          let pipe = new CurrencyPipe("en-us");
          if (params.value < 0) return pipe.transform(-params.value);
          else return pipe.transform(params.value);
        }, cellClass: (params) => {
          if (params.value >= 0) return 'red';
          else return 'green';
        }, suppressFilter: true, sortingOrder: ["desc", "asc", null]
        },
        {
          headerName: "Edit Transaction",
          cellRendererFramework: GridConfirmTransactionComponent,
          cellRendererParams: {
            transactionService: this,
            authService: authService,
            bottomSheetService: bottomSheetService,
            caption: "Edit"
          },
          suppressSorting: true, suppressFilter: true
        },
        {
          cellRendererFramework: GridCancelTransactionAdminComponent,
          cellRendererParams: {
            transactionService: this,
            caption: "Delete"
          },
          cellStyle: {textAlign: "center"},
          suppressSorting: true, suppressFilter: true
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
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
        if (window.innerWidth < 480) {
          this.myGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.myGO.api.sizeColumnsToFit();
        }
      },
      columnDefs: [
        {
          headerName: "Time", field: "time", valueFormatter: (params) => {
          let pipe = new DatePipe('en-us');
          return pipe.transform(params.value, "short");
        }, sort: "desc",
          filter: "agDateColumnFilter",
          filterValueGetter: (params) => new Date(params.data.time),
          sortingOrder: ["desc", "asc"]
        },
        {headerName: "Description", field: "description"},
        {headerName: "Detail", field: "detail", suppressSorting: true},
        {
          headerName: "Debit", field: "price", valueFormatter: (params) => {
          let pipe = new CurrencyPipe("en-us");
          if (params.value >= 0) return pipe.transform(params.value);
          else return "";
        }, cellClass: ["red"], suppressFilter: true, sortingOrder: ["desc", "asc", null]
        },
        {
          headerName: "Credit", field: "price", valueFormatter: (params) => {
          let pipe = new CurrencyPipe("en-us");
          if (params.value < 0) {
            return pipe.transform(-params.value);
          }
          else return "";
        }, cellClass: ["green"], suppressFilter: true, sortingOrder: ["desc", "asc", null]
        },
        {
          headerName: "Status",
          cellRendererFramework: GridStatusComponent,
          suppressFilter: true,
          suppressSorting: true,
          suppressResize: true
        },
        {
          cellRendererFramework: GridCancelTransactionAdminComponent,
          cellRendererParams: {
            transactionService: this,
            caption: "Cancel Transaction"
          },
          cellStyle: {textAlign: "center"},
          suppressSorting: true, suppressFilter: true
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
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

  dateLBToDateTime(): string {
    return new DatePipe("en-us").transform(this.dateLB, "yyyy-MM-ddTHH");
  }

  dateLBToDate(): string {
    return new DatePipe("en-us").transform(this.dateLB, "yyyy-MM-dd");
  }

  setDateLB(d: Date) {
    this.db.doc(environment.stateRef).update({dateLB: new DatePipe("en-us").transform(d, "yyyy-MM-dd")});
  }

  subscribe() {

    console.log("TransactionService stateSubscription subscribing");
    this.stateSubscription = this.db.doc<StateFace>(environment.stateRef).valueChanges().subscribe(state => {

      if (this.initFlag) {
        this.dateLB = new Date();
        this.dateLB.setMonth(this.dateLB.getMonth() - 1)
        this.dateLB.setHours(4); // Because database times are in GMT
        this.dateLB.setMinutes(0);
        this.dateLB.setSeconds(0);
        this.dateLB.setMilliseconds(0);
        this.initFlag = false;
      }
      else {
        this.dateLB = new Date(state.dateLB);
        this.dateLB.setHours(28); // Because database times are in GMT
        this.dateLB.setMinutes(0);
        this.dateLB.setSeconds(0);
        this.dateLB.setMilliseconds(0);
      }

      if (state) {

        if (this.transactionsSubscription) {
          console.log("TransactionService transactionSubscription unsubscribing");
          this.transactionsSubscription.unsubscribe();
        }

        console.log("TransactionService transactionsSubscription subscribing");
        this.transactionsSubscription = this.db.collection<Transaction>("transactions", ref => ref.orderBy("time", "desc").where("time", ">", this.dateLBToDateTime())).valueChanges().subscribe(transactions => {

          this.allTransactions = transactions;

          this.doneTransactions = transactions.filter(transaction => transaction.status == "done");
          if (this.doneGO.api) this.doneGO.api.setRowData(this.doneTransactions);

          this.unprocessedTransactions = transactions.filter(transaction => transaction.status != "done");
          this.unprocessedOrders = this.unprocessedTransactions.filter(transaction => !transaction.isDeposit);
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
          this.myDebit = this.myTransactions.map(t => t.status == "done" && t.price >= 0 ? parseFloat(t.price + "") : 0).reduce((acc, v) => acc + v, 0);
          this.myCredit = -1 * this.myTransactions.map(t => t.status == "done" && t.price < 0 ? parseFloat(t.price + "") : 0).reduce((acc, v) => acc + v, 0);
          if (this.myGO.api) this.myGO.api.setRowData(this.myTransactions)
          this.todayPosition = -1 * this.todayTransactions.map(t => t.status == "done" ? parseFloat(t.price + "") : 0).reduce((acc, v) => acc + v, 0);

        });

      }

    });


  }

  unsubscribe() {
    if (this.transactionsSubscription) {
      console.log("TransactionService transactionsSubscription unsubscribing");
      this.transactionsSubscription.unsubscribe();
    }

    if (this.stateSubscription) {
      console.log("TransactionService stateSubscription unsubscribing");
      this.stateSubscription.unsubscribe();
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
      return {"name": key, "n": d[key]}
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
    const unprocessedOrdersForUID = this.unprocessedOrders.filter(transaction => transaction.uid == t.uid);
    if (unprocessedOrdersForUID.length - 1 == 0) {
      this.pollService.updateVoteStatus(t.accountid.split('/')[1], "Not Ordered");
    }
  }

  //
  // getDebitCredit(){
  //   for(var i = 0; i < this.myTransactions; i++){
  //     if(status != "done")
  //   }
  // }
}
