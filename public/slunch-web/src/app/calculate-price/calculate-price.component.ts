import { Component, Inject, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { AuthService } from '../providers/auth.service';
import { TransactionService } from '../providers/transaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calculate-price',
  templateUrl: './calculate-price.component.html',
  styleUrls: ['./calculate-price.component.css']
})
export class CalculatePriceComponent implements OnDestroy{

  fixed: any = 0;
  t: any;
  transactionService: TransactionService;
  authService: AuthService;
  origPrice: any;
  backDropSubscription: Subscription;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CalculatePriceComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.t = data.t;
    this.origPrice = this.t.price;
    this.authService = data.authService;
    this.transactionService = data.transactionService;

    this.backDropSubscription = this.bottomSheetRef.backdropClick().subscribe(()=>{
      this.t.price = this.origPrice;
    });
  }

  ngOnDestroy(){
    this.backDropSubscription.unsubscribe();
  }

  calcTax(): number {
    return parseFloat((parseFloat(this.t.price) * 1.13 - this.t.price).toFixed(2));
  }

  calcTotal(): number {
    if(this.t.isDeposit) return parseFloat((parseFloat(this.t.price).toFixed(2)));
    else {
      return parseFloat((parseFloat(this.t.price) + this.calcTax() + parseFloat(this.fixed)).toFixed(2));
    }
  }

  confirmTotal() {
    let data = {
      status: "done",
      price: this.calcTotal(),
      completedBy: this.authService.getUsername()
    }
    if (this.t.isDeposit) {
      data.price = -data.price;
      this.transactionService.updateTransaction(this.t, data);
    }
    else {
      this.transactionService.updateTransaction(this.t, data);
    }
    this.bottomSheetRef.dismiss();
  }


}
