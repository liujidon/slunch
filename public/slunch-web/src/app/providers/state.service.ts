import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  db: AngularFirestore;
  state: any;

  constructor(db: AngularFirestore) {
    this.state = {
      allowOrders: false,
      allowPoll: true
    };
    this.db = db;
    this.db.doc('state/TMMQosAB4vACxDI9VUFX').valueChanges().
      subscribe(
        (state) => {
          if (state) {
            this.state = state;
          }
        });
  }

  allowOrders(): boolean {
    return this.state.allowOrders;
  }

  allowPoll(): boolean {
    return this.state.allowPoll;
  }

  setState(data){
    this.db.doc('state/TMMQosAB4vACxDI9VUFX').set(data);
  }
}
