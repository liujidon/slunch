import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { Transaction } from '../transaction';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-unprocessed',
  templateUrl: './unprocessed.component.html',
  styleUrls: ['./unprocessed.component.css']
})
export class UnprocessedComponent implements OnInit {

  transactionService: TransactionService;
  unprocessedTransactions: Array<Transaction>;
  router: Router;
  db: AngularFirestore;
  price: string;

  constructor(transactionService: TransactionService, db: AngularFirestore, router: Router) {
    this.transactionService = transactionService;
    this.router = router;
    this.db = db;
  }

  ngOnInit() {

    this.transactionService.getTransactions$().subscribe((transactions)=>{
      this.unprocessedTransactions = transactions.filter((transaction)=>{
        return !transaction.processed
      });
    });

  }

  backClick(){
    this.router.navigate(["vote"]);
  }

  confirmPurchase(t: Transaction){
    let p: any = t.price;
    let data = {
      processed: true,
      price: parseFloat(p)
    };
    this.transactionService.updateTransaction(t, data);
  }

}
