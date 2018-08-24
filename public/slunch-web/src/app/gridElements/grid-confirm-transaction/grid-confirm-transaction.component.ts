import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { AuthService } from '../../providers/auth.service';
import { Transaction } from '../../transaction';

@Component({
  selector: 'app-grid-confirm-transaction',
  templateUrl: './grid-confirm-transaction.component.html',
  styleUrls: ['./grid-confirm-transaction.component.css']
})
export class GridConfirmTransactionComponent {

  transactionService: TransactionService;
  authService: AuthService;
  t: Transaction;

  agInit(params){
    this.transactionService = params.transactionService;
    this.authService = params.authService;
    this.t = params.data;
  }

  confirmTransaction(t: Transaction) {
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
    this.transactionService.updateTransaction(t, data);
  }

}
