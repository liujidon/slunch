import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { Transaction } from '../transaction';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-unprocessed',
  templateUrl: './unprocessed.component.html',
  styleUrls: ['./unprocessed.component.css']
})
export class UnprocessedComponent implements OnInit {

  transactionService: TransactionService;
  unprocessedTransactions: Array<Transaction>;
  db: AngularFirestore;

  constructor(transactionService: TransactionService, db: AngularFirestore) {
    this.transactionService = transactionService;
  }

  ngOnInit() {

    this.transactionService.getTransactions$().subscribe((transactions)=>{
      this.unprocessedTransactions = transactions.filter((transaction)=>{
        return !transaction.processed
      });
    });

  }




  confirmClick(o: Transaction){
    
  }

}
