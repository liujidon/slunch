import { Injectable } from '@angular/core';
import { PollOption } from '../poll-option';
import { Poll } from '../poll';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  pollOptions: Array<PollOption> = [];
  pollOptionsDS: MatTableDataSource<PollOption>;
  pollOptionsSubscription: Subscription;

  latestPollSubscription: Subscription;
  latestPoll: Poll;

  constructor(public db: AngularFirestore, public authService: AuthService) {
  }

  subscribe(){
    console.log("PollService latestPollSubscription subscribing");
    this.latestPollSubscription = this.db.collection<Poll>('poll', ref => ref.orderBy('createtime', 'desc').limit(1)).valueChanges().subscribe(pollArray=>{
      this.latestPoll = pollArray[0];
    });

    console.log("PollService pollOptionsSubscription subscribing");
    this.pollOptionsSubscription = this.db.collection<PollOption>('poll-options').snapshotChanges().subscribe(docChangeActions=>{
      this.pollOptions = docChangeActions.map(docChangeAction=>{
        let doc:any = docChangeAction.payload.doc;
        let po = doc.data();
        po.id = doc.id;
        return po;
      }, PollOption);
      this.pollOptionsDS = new MatTableDataSource(this.pollOptions.sort((a, b) => a.name < b.name ? -1 : 1));
    });

  }

  unsubscribe(){
    if(this.latestPollSubscription){
      console.log("PollService latestPollSubscription unsubscribing");
      this.latestPollSubscription.unsubscribe();
    }

    if(this.pollOptionsSubscription){
      console.log("PollService pollOptionsSubscription unsubscribing");
      this.pollOptionsSubscription.unsubscribe();
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
      this.db.collection<Poll>('poll').doc(poll.id).set(JSON.parse(JSON.stringify(poll)));
  }


  updatePollOption(po:PollOption){
    this.db.doc("poll-options/"+po.id).update(po);
  }

  writePollOption(name: string){
    let po: any;
    let id: string = this.db.createId();
    po = {
      name:name,
      iconUrl: environment.defaultIconUrl,
      menuUrl:"http://www.google.com",
      id:id
    }
    this.db.collection<PollOption>("poll-options").doc(id).set(JSON.parse(JSON.stringify(po)));
  }

  deletePollOption(po:PollOption){
    this.db.doc("poll-options/"+po.id).delete();
  }

}
