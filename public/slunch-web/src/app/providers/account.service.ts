/**
 * Created by MichaelWang on 2018-10-14.
 */
import {Injectable, Pipe} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {Transaction} from '../transaction';
import {Subscription, Operator, Observable,} from 'rxjs';
import {GridOptions, CsvExportParams} from 'ag-grid';
import {DatePipe, CurrencyPipe} from '@angular/common';
import {GridStatusComponent} from '../gridElements/grid-status/grid-status.component';
import {GridCancelTransactionComponent} from '../gridElements/grid-cancel-transaction/grid-cancel-transaction.component';
import {environment} from '../../environments/environment';
import {StateFace} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  db: AngularFirestore;
  public myGO: GridOptions;
  myTransactions: Array<Transaction> = [];
  myDebit: number = 0;
  myCredit: number = 0;
  dateLB: Date;
  private accountTransactionSubscription: Subscription;
  private stateSubscription: Subscription;
  initFlag: boolean = true;

  constructor(db: AngularFirestore, public authService: AuthService) {
    this.db = db;
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
          suppressResize: true, width: 100
        },
        {
          cellRendererFramework: GridCancelTransactionComponent,
          cellRendererParams: {
            transactionService: this,
            caption: "Cancel Transaction"
          },
          cellStyle: {textAlign: "center"},
          suppressSorting: true, suppressFilter: true, width: 100, suppressResize: true
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }
  }

  subscribe() {

    console.log("AccountService stateSubscription subscribing");
    this.stateSubscription = this.db.doc<StateFace>(environment.stateRef).valueChanges().subscribe(state => {
      if (this.initFlag) {
        this.dateLB = new Date();
        this.dateLB.setDate(this.dateLB.getDate() - 7);
        this.dateLB.setHours(4); // Because database times are in GMT
        this.dateLB.setMinutes(0);
        this.dateLB.setSeconds(0);
        this.dateLB.setMilliseconds(0);
        this.initFlag = false;
      }
      else {
        this.dateLB = new Date(state.myTransactionDateLB);
        this.dateLB.setHours(28); // Because database times are in GMT
        this.dateLB.setMinutes(0);
        this.dateLB.setSeconds(0);
        this.dateLB.setMilliseconds(0);
      }

      if (state) {
        console.log("AccountService accountTransactionSubscription subscribing");
        this.accountTransactionSubscription = this.db.collection<Transaction>("transactions", ref => ref.orderBy("time", "desc").where("email", "==", this.authService.getEmail()).where("time", ">", this.dateLBToDateTime())).valueChanges().subscribe(transactions => {
          this.myTransactions = transactions.filter(transaction => transaction.uid == this.authService.getUid());
          this.myDebit = this.myTransactions.map(t => t.status == "done" && t.price >= 0 ? parseFloat(t.price + "") : 0).reduce((acc, v) => acc + v, 0);
          this.myCredit = -1 * this.myTransactions.map(t => t.status == "done" && t.price < 0 ? parseFloat(t.price + "") : 0).reduce((acc, v) => acc + v, 0);
          if (this.myGO.api) this.myGO.api.setRowData(this.myTransactions)
        });

      }
    });
  }

  unsubscribe() {
    console.log("AccountService accountTransactionSubscription unsubscribing");
    if (this.accountTransactionSubscription != null) {
      this.accountTransactionSubscription.unsubscribe()
    }

    console.log("AccountService stateSubscription unsubscribing");
    if (this.stateSubscription != null) {
      this.stateSubscription.unsubscribe()
    }
  }

  dateLBToDateTime(): string {
    return new DatePipe("en-us").transform(this.dateLB, "yyyy-MM-ddTHH");
  }

  setDateLB(d: Date) {
    this.db.doc(environment.stateRef).update({myTransactionDateLB: new DatePipe("en-us").transform(d, "yyyy-MM-dd")});
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
}
