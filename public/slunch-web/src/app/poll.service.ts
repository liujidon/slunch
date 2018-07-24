import { Injectable } from '@angular/core';
import { PollOption } from './poll-option';
import { Poll } from './poll';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  db: AngularFirestore;
  private pollCollection;

  constructor(db: AngularFirestore) {
      this.db = db;
      this.pollCollection = db.collection<Poll>('poll');
  }

  getPollOptions(): Observable<PollOption[]> {
    return this.db.collection<PollOption>('poll-options').valueChanges();;
  }

  getLatestPoll(): Observable<any[]> {
    return this.db.collection<Poll>('poll', ref => ref.orderBy('createtime', 'desc').limit(1)).valueChanges();
  }

  updatePoll(poll:Poll) {
    if(poll.id == null)
      poll.id = this.db.createId();
    this.pollCollection.doc(poll.id).set(JSON.parse(JSON.stringify(poll)));
  }

}
