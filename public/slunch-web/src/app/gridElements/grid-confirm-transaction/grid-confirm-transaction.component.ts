import { Component } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { AuthService } from '../../providers/auth.service';
import { Transaction } from '../../transaction';
import { MatBottomSheet } from '@angular/material';
import { CalculatePriceComponent } from '../../calculate-price/calculate-price.component';

@Component({
  selector: 'app-grid-confirm-transaction',
  templateUrl: './grid-confirm-transaction.component.html',
  styleUrls: ['./grid-confirm-transaction.component.css']
})
export class GridConfirmTransactionComponent {

  transactionService: TransactionService;
  authService: AuthService;
  t: Transaction;
  bottomSheetService: MatBottomSheet
  caption: string;

  agInit(params) {
    this.transactionService = params.transactionService;
    this.authService = params.authService;
    this.t = params.data;
    this.bottomSheetService = params.bottomSheetService;
    this.caption = params.caption;
  }

  confirmTransaction(t: Transaction) {
    let data = {
      transactionService: this.transactionService,
      authService: this.authService,
      t: this.t
    }

    this.bottomSheetService.open(CalculatePriceComponent, { data: data });
  }

}
