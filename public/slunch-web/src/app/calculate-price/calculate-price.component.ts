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
  foundRestaurant = false;
  pastOrder: any
  orderSimilarities: Array<object>;


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
      this.orderSimilarities = []
      this.t.price = (data.t.price / 1.13).toFixed(2);
    }
    else {
      this.pastOrderSubscription = this.db.collection<PastOrder>("past-order").valueChanges().subscribe(restaurants => {
        this.orderSimilarities = []
        var restaurant = restaurants.filter(restaurantOrders => restaurantOrders.restaurant == this.t.description)
        if (restaurant.length != 0) {
          this.foundRestaurant = true;
          this.pastOrder = restaurant[0]
          if (this.t.detail in this.pastOrder.orders) {
            this.t.price = parseFloat(parseFloat(this.pastOrder.orders[this.t.detail] + "").toFixed(2));
          }
          else if (this.t.detail.toLowerCase() in this.pastOrder.orders) {
            this.t.detail = this.t.detail.toLowerCase()
            this.t.price = parseFloat(parseFloat(this.pastOrder.orders[this.t.detail.toLowerCase()] + "").toFixed(2));
          }
          else {
            var orders = this.pastOrder.orders
            var similarities = this.calcSimilarities(orders)
            this.orderSimilarities = similarities;
          }
        }
      })
    }
    this.backDropSubscription = this.bottomSheetRef.backdropClick().subscribe(() => {
      this.t.price = this.origPrice;
    });
  }

  ngOnDestroy() {
    this.backDropSubscription.unsubscribe();
    if (this.pastOrderSubscription != null) {
      this.pastOrderSubscription.unsubscribe();
    }
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
      if (this.t.status != "done") {
        if (this.foundRestaurant) {
          if (this.t.price != this.pastOrder.orders[this.t.detail] * 1.13) {
            this.pastOrderService.updateOrderPrice(this.t, this.pastOrder);
          }
        }
        else {
          this.pastOrderService.addOrderPrice(this.t)
        }
      }
      this.transactionService.updateTransaction(this.t, data);
    }
    this.bottomSheetRef.dismiss();
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  calcSimilarities(orders) {
    var finalOrderSimilarities = []
    var keys = Object.keys(orders)
    for (var i = 0; i < keys.length; i++) {
      var currSimilarity = {}

      var similarity = this.similarity(this.t.detail, keys[i])
      if (similarity > 0.7) {
        currSimilarity["name"] = keys[i]
        currSimilarity["similarity"] = similarity
        currSimilarity["price"] = orders[keys[i]]
        currSimilarity["checked"] = false;
        finalOrderSimilarities.push(currSimilarity)
      }
    }
    finalOrderSimilarities.sort(function (a, b) {
      return b.similarity - a.similarity;
    })
    if (finalOrderSimilarities.length > 3) {
      var topThree = finalOrderSimilarities.slice(0, 3);
      return topThree
    }
    return finalOrderSimilarities
  }


  similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  close() {
    this.t.price = this.origPrice;
    this.bottomSheetRef.dismiss();
  }

  changeCheckbox(orderIndex, order) {
    for (var i = 0; i < this.orderSimilarities.length; i++) {
      if (i == orderIndex && order == this.orderSimilarities[i]) {
        if (order["checked"])
          this.t.price = parseFloat(parseFloat(this.orderSimilarities[i]["price"] + "").toFixed(2));
        else
          this.t.price = 0;
      }
      else {
        this.orderSimilarities[i]["checked"] = false;
      }
    }
  }
}
