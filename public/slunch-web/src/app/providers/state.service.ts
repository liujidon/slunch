import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { StateFace } from '../interfaces';
import { Subscription } from 'rxjs';

import { ref } from '../database';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  db: AngularFirestore;
  state: StateFace;
  isOrdering: boolean;
  newPollToggled: boolean;

  private stateSubscription: Subscription;

  constructor(db: AngularFirestore) {
    this.db = db;
    this.newPollToggled = false;
  }

  subscribe(){
    console.log("StateService stateSubscription subscribing");
    this.stateSubscription = this.db.doc<StateFace>(ref.state).valueChanges().subscribe((state)=>{
      this.state = state;
      this.isOrdering = state.allowOrders;
    });
  }

  unsubscribe(){
    if(this.stateSubscription){
      console.log("StateService stateSubscription unsubscribing");
      this.stateSubscription.unsubscribe();
    }
  }
  
  setState(data){
    this.db.doc<StateFace>(ref.state).set(data);
  }


}
