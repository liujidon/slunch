import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {AccountFace} from '../interfaces';
import {Subscription} from 'rxjs';
import {MatTableDataSource, MatTab} from '@angular/material';
import {GridOptions} from 'ag-grid';
import {CurrencyPipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  accounts: Array<AccountFace> = [];
  accountsSubscription: Subscription;

  totalBalance: number = 0;

  accountsGO: GridOptions;

  constructor(public authService: AuthService, public db: AngularFirestore) {

    this.accountsGO = {
      onGridReady: (params) => {
        this.accountsGO.api = params.api;
        this.accountsGO.columnApi = params.columnApi;
        this.accountsGO.api.setRowData(this.accounts);
        if (window.innerWidth < 480) {
          this.accountsGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.accountsGO.api.sizeColumnsToFit();
        }
      },
      columnDefs: [
        {headerName: "Email", field: "email"},
        {
          headerName: "Balance", field: "balance", valueFormatter: (params) => {
          let pipe = new CurrencyPipe("en-us");
          return pipe.transform(params.value);
        }, cellClass: (params) => {
          if (params.value > 0) return "green";
          else return "red";
        }, sortingOrder: ["desc", "asc"], sort: "desc", suppressFilter: true
        },
        {
          headerName: "Name", valueGetter: (params) => {
          return params.data.firstname + " " + params.data.lastname;
        }
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
    console.log("AdminService accountSubscription subscribing");
    this.accountsSubscription = this.db.collection<AccountFace>("accounts").valueChanges().subscribe(accounts => {
      this.accounts = accounts;
      if (this.accountsGO.api) this.accountsGO.api.setRowData(this.accounts);

      this.totalBalance = this.accounts.map(a => a.balance).reduce((acc, v) => acc + v, 0);

    });
  }

  unsubscribe() {
    console.log("AdminService accountsSubscription unsubscribing");
    this.accountsSubscription.unsubscribe();

  }


}
