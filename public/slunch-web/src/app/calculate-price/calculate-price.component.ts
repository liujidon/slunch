import {Component, Inject, OnDestroy} from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import {AuthService} from '../providers/auth.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {TransactionService} from '../providers/transaction.service';
import {PastOrderService} from '../providers/past-order.service';
import {Subscription} from 'rxjs';
import {PastOrder} from '../past-order';

@Component({
  selector: 'app-calculate-price',
  templateUrl: './calculate-price.component.html',
  styleUrls: ['./calculate-price.component.css']
})
export class CalculatePriceComponent implements OnDestroy {

  db: AngularFirestore;
  fixed: any = 0;
  t: any;
  transactionService: TransactionService;
  pastOrderService: PastOrderService;
  authService: AuthService;
  origPrice: any;
  backDropSubscription: Subscription;
  pastOrderSubscription: Subscription;
  foundPastOrder = false;
  pastOrder: any


  constructor(private bottomSheetRef: MatBottomSheetRef<CalculatePriceComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, db: AngularFirestore, pastOrderService: PastOrderService) {
    this.db = db;
    this.t = data.t;
    this.origPrice = this.t.price;
    this.authService = data.authService;
    this.transactionService = data.transactionService;
    this.pastOrderService = pastOrderService

    if (this.t.isDeposit) {
      this.t.price = data.t.price
    }
    else if (this.t.status == "done") {
      this.t.price = (data.t.price / 1.13).toFixed(2);
    }
    else {
      this.pastOrderSubscription = this.db.collection<PastOrder>("past-order").valueChanges().subscribe(pastOrders => {
        var filter = pastOrders.filter(pastOrder => pastOrder.order == this.t.detail && pastOrder.restaurant == this.t.description)
        if (filter.length != 0) {
          this.foundPastOrder = true;
          this.pastOrder = filter[0]
          this.t.price = parseFloat(parseFloat(this.pastOrder.price + "").toFixed(2));
        }
      })
    }
    this.backDropSubscription = this.bottomSheetRef.backdropClick().subscribe(() => {
      this.t.price = this.origPrice;
    });
  }

  ngOnDestroy() {
    this.backDropSubscription.unsubscribe();
  }

  calcTax(): number {
    return parseFloat((parseFloat(this.t.price) * 1.13 - this.t.price).toFixed(2));
  }

  calcTotal(): number {
    if (this.t.isDeposit) return parseFloat((parseFloat(this.t.price).toFixed(2)));
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
      if (this.t.status != "done") {
        if (this.foundPastOrder) {
          if (this.t.price != this.pastOrder.price * 1.13) {
            this.pastOrderService.updateOrderPrice(this.t, this.pastOrder);
          }
        }
        else {
          this.pastOrderService.addOrderPrice(this.t)
        }
      }
    }
    this.bottomSheetRef.dismiss();
  }

  close() {
    this.t.price = this.origPrice;
    this.bottomSheetRef.dismiss();
  }


}
