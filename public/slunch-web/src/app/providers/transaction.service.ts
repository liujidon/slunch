import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Transaction } from '../transaction';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { GridOptions, ColumnApi, GridApi, ColDef } from 'ag-grid';
import { FormatterService } from './formatter.service';

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
  unprocessedTransactionsDS: MatTableDataSource<Transaction>;
  todayTransactionsDS: MatTableDataSource<Transaction>;

  numUnprocessed: number;

  public unprocessedGridApi: GridApi;
  public unprocessedGridColumnApi: ColumnApi;
  public unprocessedGridOptions: GridOptions;
  public unprocessedColumnDefs: ColDef[];


  constructor(
    public authService: AuthService,
    public db: AngularFirestore,
    public formatterService: FormatterService
  ) {

    this.unprocessedColumnDefs = [
      { headerName: "Time", field: "time" },
      { headerName: "Name", field: "displayName" },
      { headerName: "Description", field: "description" },
      { headerName: "Detail", field: "detail" },
      { headerName: "Price", field: "price", editable: true },
      {
        headerName: "Status", field: "status", tooltip: (params => {
          let o = params.data;
          if (params.value == "new") return "Pending";
          else if (params.value == "ack") return "Acked by: " + o.ackedBy;
          else if (params.value == "ordered") return "Ordered by: " + o.orderedBy;
          else if (params.value == "done") return "Completed by: " + o.completedBy;
        })
      },
      {
        headerName: "Acknowledge", onCellClicked: (event) => {
          let t = event.data;
          let data = {
            status: "ack",
            ackedBy: this.authService.getUsername()
          }
          this.updateTransaction(t, data);
        }
      },
      {
        headerName: "Ordered", onCellClicked: (event) => {
          let t = event.data;
          let data = {
            status: "ordered",
            orderedBy: this.authService.getUsername()
          }
          this.updateTransaction(t, data);
        }
      },
      {
        headerName: "Confirm", onCellClicked: (event) => {
          let t = event.data;
          let p: any = t.price;
          if (t.isDeposit) {
            p = -parseFloat(p);
          }
          else {
            p = parseFloat(p);
          }
          let data = {
            status: "done",
            price: p,
            completedBy: this.authService.getUsername()
          };
          this.updateTransaction(t, data);
        }
      }
    ]

    this.unprocessedGridOptions = {
      getRowNodeId: (data) => data.time
    }

  }

  unprocessedOnGridReady(params) {
    this.unprocessedGridApi = params.api;
    this.unprocessedGridColumnApi = params.columnApi;
    this.unprocessedGridUpdate();
  }

  unprocessedGridUpdate() {
    if (this.unprocessedGridApi) {
      this.unprocessedGridApi.setRowData(this.unprocessedTransactions);
      this.unprocessedGridApi.sizeColumnsToFit();
    }
  }

  subscribe() {

    console.log("TransactionService transactionsSubscription subscribing");
    this.transactionsSubscription = this.db.collection<Transaction>("transactions").valueChanges().subscribe(transactions => {
      this.allTransactions = transactions;

      this.unprocessedTransactions = transactions.filter(transaction => transaction.status != "done");
      this.unprocessedGridUpdate();

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

      this.unprocessedTransactionsDS = new MatTableDataSource(this.unprocessedTransactions.sort((a, b) => a.time >= b.time ? -1 : 1));
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
      if (orders.indexOf(t.detail) === -1) {
        orders.push(t.detail.toLowerCase());
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

    return orders.map(x => x.name).slice(0, 3);
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
