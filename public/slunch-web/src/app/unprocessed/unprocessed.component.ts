import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { Transaction } from '../transaction';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '../../../node_modules/@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';
import { StateService } from '../providers/state.service';

@Component({
  selector: 'app-unprocessed',
  templateUrl: './unprocessed.component.html',
  styleUrls: ['./unprocessed.component.css']
})
export class UnprocessedComponent implements OnInit {

  transactionService: TransactionService;
  stateService: StateService;
  unprocessedTransactions: MatTableDataSource<Transaction>;
  router: Router;
  db: AngularFirestore;
  price: string;
  displayedColumns: Array<string> = [
    "time", "name", "description", "detail", 
    "price", "status", "acknowledge", "confirm"
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(transactionService: TransactionService, stateService: StateService, db: AngularFirestore, router: Router) {
    this.transactionService = transactionService;
    this.stateService = stateService;
    this.router = router;
    this.db = db;
  }

  ngOnInit() {

    this.transactionService.getTransactions$().subscribe((transactions)=>{
      this.unprocessedTransactions = new MatTableDataSource(transactions.filter(transaction=>transaction.status != "done"));
      this.unprocessedTransactions.paginator = this.paginator;
      this.unprocessedTransactions.sort = this.sort;
      
      this.sort.start = "desc";
      this.sort.disableClear = true;

    });

  }

  backClick(){
    this.router.navigate(["vote"]);
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
      price: p
    };
    this.transactionService.updateTransaction(t, data);
  }

  acknowledgeTransaction(t: Transaction){
    this.transactionService.updateTransaction(t, {status: "ack"});
  }

}
