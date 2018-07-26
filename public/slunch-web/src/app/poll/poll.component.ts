import { Component, OnInit } from '@angular/core';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';
import { PollService } from '../poll.service';
import { Observable } from 'rxjs';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  poll: Poll;
  newOption: String;
  pollOptions$: Observable<PollOption[]>;

  constructor(public pollService: PollService, public authService: AuthService) {
    this.poll = new Poll("");
  }

  ngOnInit() {
    this.getPollOptions();
    this.pollService.getLatestPoll()
      .subscribe(poll => {
        this.poll = poll[0];
      });
  }

  getPollOptions(): void {
    this.pollOptions$ = this.pollService.getPollOptions();
  }


  updateVote(option) {
    let name = this.authService.getUsername();
    let index = option.votes.indexOf(name);
    if(index > -1)
      option.votes.splice(index, 1);
    else
      option.votes.push(name);

    this.pollService.updatePoll(this.poll);
  }

}
