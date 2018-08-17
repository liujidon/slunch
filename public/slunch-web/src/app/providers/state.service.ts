import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { StateFace } from '../interfaces';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  db: AngularFirestore;
  state: StateFace;
  isOrdering: boolean;

  private stateSubscription: Subscription;

  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribe(){
    console.log("StateService stateSubscription subscribing");
    this.stateSubscription = this.db.doc<StateFace>(environment.stateRef).valueChanges().subscribe((state)=>{
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
    this.db.doc<StateFace>(environment.stateRef).update(data);
  }


}
