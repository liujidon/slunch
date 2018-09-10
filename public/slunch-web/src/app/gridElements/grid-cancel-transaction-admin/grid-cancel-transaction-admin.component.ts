import { Component } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { Transaction } from '../../transaction';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-grid-cancel-transaction-admin',
  templateUrl: './grid-cancel-transaction-admin.component.html',
  styleUrls: ['./grid-cancel-transaction-admin.component.css']
})
export class GridCancelTransactionAdminComponent {

  transactionService: TransactionService;
  t: Transaction;
  caption: string;

  constructor(
    public authService: AuthService,
  ) { }

  agInit(params){
    this.transactionService = params.transactionService;
    this.t = params.data;
    this.caption = params.caption;
  }

  cancelTransaction(t: Transaction){
    this.transactionService.cancelTransaction(t);
  }

}
