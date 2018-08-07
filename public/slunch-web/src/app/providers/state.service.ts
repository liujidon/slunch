import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { StateFace } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  db: AngularFirestore;
  state: StateFace;
  isOrdering: boolean;
  newPollToggled: boolean;

  constructor(db: AngularFirestore) {
    this.db = db;
    this.db.doc<StateFace>('state/TMMQosAB4vACxDI9VUFX').valueChanges().subscribe((state)=>{
      this.state = state;
      this.isOrdering = state.allowOrders;
    }, ()=>console.log("ERROR: StateService line 16"));
    this.newPollToggled = false;
  }
  
  setState(data){
    this.db.doc<StateFace>('state/TMMQosAB4vACxDI9VUFX').set(data);
  }


}
