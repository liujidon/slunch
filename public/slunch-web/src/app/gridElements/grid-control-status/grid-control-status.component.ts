import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../transaction';
import { AuthService } from '../../providers/auth.service';
import { TransactionService } from '../../providers/transaction.service';

@Component({
  selector: 'app-grid-control-status',
  templateUrl: './grid-control-status.component.html',
  styleUrls: ['./grid-control-status.component.css']
})
export class GridControlStatusComponent {

  t: Transaction;
  transactionService: TransactionService;
  authService: AuthService;

  agInit(params) {
    this.t = params.data;
    this.transactionService = params.transactionService;
    this.authService = params.authService;
  }

  confirmOrdered(t: Transaction) {
    let data = {
      status: "ordered",
      orderedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

  acknowledgeTransaction(t: Transaction) {
    let data = {
      status: "ack",
      ackedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

}
