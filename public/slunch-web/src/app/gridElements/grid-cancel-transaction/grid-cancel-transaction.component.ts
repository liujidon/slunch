import { Component } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { Transaction } from '../../transaction';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-grid-cancel-transaction',
  templateUrl: './grid-cancel-transaction.component.html',
  styleUrls: ['./grid-cancel-transaction.component.css']
})
export class GridCancelTransactionComponent {

  transactionService: TransactionService;
  t: Transaction;

  constructor(
    private dialog: MatDialog
  ) { }

  agInit(params){
    this.transactionService = params.transactionService;
    this.t = params.data;
  }

  cancelTransaction(t: Transaction){
    this.transactionService.cancelTransaction(t);
  }

  openDialog(t: Transaction) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {'transaction': t, 'transactionService': this.transactionService};
    dialogConfig.width = '350px';
    dialogConfig.height = '200px';

    this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }
}
