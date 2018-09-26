import { Component } from '@angular/core';
import { TransactionService } from '../../providers/transaction.service';
import { Transaction } from '../../transaction';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../providers/auth.service';
import {MatDialog, MatDialogConfig} from "@angular/material";

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
    private dialog: MatDialog
  ) { }

  agInit(params){
    this.transactionService = params.transactionService;
    this.t = params.data;
    this.caption = params.caption;
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
