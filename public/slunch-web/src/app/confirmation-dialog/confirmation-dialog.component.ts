/**
 * Created by MichaelWang on 2018-09-25.
 */
import {Component, OnInit, Inject} from '@angular/core';
import {TransactionService} from '../providers/transaction.service';
import {Transaction} from '../transaction';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  transactionService: TransactionService;
  t: Transaction;

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.t = data.transaction;
    this.transactionService = data.transactionService;

  }

  ngOnInit() {
  }

  deleteTransaction() {
    this.transactionService.cancelTransaction(this.t);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
