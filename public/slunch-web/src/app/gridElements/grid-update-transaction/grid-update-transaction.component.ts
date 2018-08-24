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
  color: string;
  condition: any;

  agInit(params){
    this.t = params.data;
    this.transactionService = params.transactionService;
    this.color = params.color;
    this.condition = params.condition;
  }

  updateTransaction(t: Transaction){
    this.transactionService.updateTransaction(t, {price: t.price});
  }

}
