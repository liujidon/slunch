import { Component, OnInit } from '@angular/core';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';
import { PollService } from '../providers/poll.service';
import { Observable } from 'rxjs';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  poll: Poll;
  pollOptions$: Observable<PollOption[]>;

  constructor(public pollService: PollService, public authService: AuthService) {
    this.poll = new Poll("");
  }

  ngOnInit() {
    this.getPollOptions();
    this.pollService.getLatestPoll()
      .subscribe(poll => {
        this.poll = poll[0];
      }, ()=>console.log("ERROR: PollComponent line 23"));
  }

  getPollOptions(): void {
    this.pollOptions$ = this.pollService.getPollOptions();
  }


  updateVote(option: PollOption) {
    let uid = this.authService.getUid();
    let name = this.authService.getUsername();
    
    let uidIndex = option.uidVotes.indexOf(uid);
    let nameIndex = option.votes.indexOf(name);

    if(nameIndex > -1)
      option.votes.splice(nameIndex, 1);
    else
      option.votes.push(name);

    if(uidIndex > -1)
      option.uidVotes.splice(uidIndex, 1);
    else
      option.uidVotes.push(uid);

    this.pollService.updatePoll(this.poll);
  }

}
