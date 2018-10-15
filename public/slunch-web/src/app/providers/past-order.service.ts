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
    pastOrder.price = parseFloat(parseFloat(t.price + "").toFixed(2))
    pastOrder.order = t.detail
    pastOrder.restaurant = t.description
    this.db.collection<PastOrder>("past-order").doc(id).set(JSON.parse(JSON.stringify(pastOrder)));
  }

  updateOrderPrice(t: any, pastOrder: any) {
    let data = {
      "price": parseFloat(parseFloat(t.price + "").toFixed(2))
    }
    this.db.doc(pastOrder.id).update(data);
  }
}
