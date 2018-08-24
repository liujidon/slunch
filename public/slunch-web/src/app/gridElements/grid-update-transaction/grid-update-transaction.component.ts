import { Component } from '@angular/core';
import { Transaction } from '../../transaction';
import { TransactionService } from '../../providers/transaction.service';

@Component({
  selector: 'app-grid-update-transaction',
  templateUrl: './grid-update-transaction.component.html',
  styleUrls: ['./grid-update-transaction.component.css']
})
export class GridUpdateTransactionComponent {

  t: Transaction;
  transactionService: TransactionService;

  agInit(params){
    this.t = params.data;
    this.transactionService = params.TransactionService;
  }

  updateTransaction(t: Transaction){
    this.transactionService.updateTransaction(t, {price: t.price});
  }

}
