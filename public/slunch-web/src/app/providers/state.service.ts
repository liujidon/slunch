import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { StateFace } from '../interfaces';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  state: StateFace;
  stateDocument: AngularFirestoreDocument;
  stateObservable$: Observable<DocumentData>;

  constructor(db: AngularFirestore) {
    this.stateDocument = db.doc('state/TMMQosAB4vACxDI9VUFX');
    this.stateObservable$ = this.stateDocument.valueChanges();
    this.state = {allowOrders: false, allowPoll: false};
    this.stateObservable$.subscribe(
      (state:StateFace)=>{if(state){this.state = state;}}
    );
  }

  getStateObservable(){return this.stateObservable$;}
  allowOrders(): boolean {return this.state.allowOrders;}
  allowPoll(): boolean {return this.state.allowPoll;}
  setState(data){this.stateDocument.set(data);}
}
