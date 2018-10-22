/**
 * Created by MichaelWang on 2018-10-14.
 */
import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {PastOrder} from '../past-order';
import {Subscription} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PastOrderService {
  db: AngularFirestore;

  private pastOrderSubscription: Subscription;

  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribe() {

  }

  unsubscribe() {

  }

  addOrderPrice(t: any) {
    let id = this.db.createId();
    let pastOrder = new PastOrder();
    pastOrder.id = "past-order/" + id
    pastOrder.orders[t.detail] = parseFloat(parseFloat(t.price + "").toFixed(2))
    pastOrder.restaurant = t.description
    this.db.collection<PastOrder>("past-order").doc(id).set(JSON.parse(JSON.stringify(pastOrder)));
  }

  updateOrderPrice(t: any, pastOrder: any) {
    var newData = pastOrder.orders
    newData[t.detail] = parseFloat(parseFloat(t.price + "").toFixed(2))
    let data = {
      "orders": newData
    }
    this.db.doc(pastOrder.id).update(data);
  }
}
