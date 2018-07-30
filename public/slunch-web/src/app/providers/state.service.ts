import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { StateFace } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  db: AngularFirestore;

  constructor(db: AngularFirestore) {
    this.db = db;
  }

  getState$(){
    return this.db.doc<StateFace>('state/TMMQosAB4vACxDI9VUFX').valueChanges();
  }
  
  setState(data){
    this.db.doc<StateFace>('state/TMMQosAB4vACxDI9VUFX').set(data);
  }
}
