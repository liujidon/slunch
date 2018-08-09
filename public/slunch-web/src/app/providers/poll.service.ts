import { Injectable } from '@angular/core';
import { PollOption } from '../poll-option';
import { Poll } from '../poll';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  db: AngularFirestore;
  authService: AuthService;
  private pollCollection;
  pollOptions$: Observable<PollOption[]>;

  latestPollSubscription: Subscription;
  latestPoll: Poll;

  constructor(db: AngularFirestore, authService: AuthService) {
      this.db = db;
      this.authService = authService;
      this.pollCollection = db.collection<Poll>('poll');
      this.pollOptions$ = db.collection<PollOption>('poll-options').valueChanges();
  }

  subscribe(){
    console.log("PollService latestPollSubscription subscribing");
    this.latestPollSubscription = this.db.collection<Poll>('poll', ref => ref.orderBy('createtime', 'desc').limit(1)).valueChanges().subscribe(pollArray=>{
      this.latestPoll = pollArray[0];
    });

  }

  unsubscribe(){
    if(this.latestPollSubscription){
      console.log("PollService latestPollSubscription unsubscribing");
      this.latestPollSubscription.unsubscribe();
    }

  }

  getAdminSelectedOptions(){
    if(this.latestPoll){
      return this.latestPoll.options.filter(po=>po.uidVotes.filter(uid=>this.authService.adminUids.includes(uid)).length > 0);
    }
    else{
      return [];
    }
    
  }

  updatePoll(poll:Poll) {
    if(poll.id == null)
      poll.id = this.db.createId();
    this.pollCollection.doc(poll.id).set(JSON.parse(JSON.stringify(poll)));
  }

}
