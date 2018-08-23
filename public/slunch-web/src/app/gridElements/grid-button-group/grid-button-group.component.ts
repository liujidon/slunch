import { Component } from '@angular/core';
import { Transaction } from '../../transaction';
import { TransactionService } from '../../providers/transaction.service';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-grid-button-group',
  templateUrl: './grid-button-group.component.html',
  styleUrls: ['./grid-button-group.component.css']
})
export class GridButtonGroupComponent {

  t: Transaction;
  transactionService: TransactionService;
  authService: AuthService;

  agInit(params){
    this.t = params.data;
    this.transactionService = params.transactionService;
    this.authService = params.authService;
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

