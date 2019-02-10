import { Component } from '@angular/core';
import { AccountService } from '../../providers/account.service';
import { Transaction } from '../../transaction';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-grid-cancel-transaction',
  templateUrl: './grid-cancel-transaction.component.html',
  styleUrls: ['./grid-cancel-transaction.component.css']
})
export class GridCancelTransactionComponent {

  accountService: AccountService;
  t: Transaction;

  constructor(
    private dialog: MatDialog
  ) { }

  agInit(params){
    this.accountService = params.accountService;
    this.t = params.data;
  }

  cancelTransaction(t: Transaction){
    this.accountService.cancelTransaction(t);
  }

  openDialog(t: Transaction) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {'transaction': t, 'service': this.accountService};
    dialogConfig.width = '350px';
    dialogConfig.height = '200px';

    this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }
}
