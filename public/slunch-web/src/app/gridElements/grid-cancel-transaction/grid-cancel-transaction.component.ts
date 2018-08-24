import { Component } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { Transaction } from '../../transaction';

@Component({
  selector: 'app-grid-cancel-transaction',
  templateUrl: './grid-cancel-transaction.component.html',
  styleUrls: ['./grid-cancel-transaction.component.css']
})
export class GridCancelTransactionComponent {

  transactionService: TransactionService;
  t: Transaction;

  agInit(params){
    this.transactionService = params.transactionService;
    this.t = params.data;
  }

  cancelTransaction(t: Transaction){
    this.transactionService.cancelTransaction(t);
  }

}
