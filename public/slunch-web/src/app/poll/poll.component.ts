import { Component, OnInit } from '@angular/core';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  poll: Poll;
  pollOptions: PollOption[];
  newPoll: Poll;
  newOption: String;

  constructor(private pollService: PollService) {
    this.poll = new Poll();
    this.pollOptions = new PollOption();
    this.newPoll = new Poll();
  }

  ngOnInit() {
    this.getPollOptions();
    this.pollService.getLatestPoll()
      .subscribe(poll => {
        this.poll = poll[0];
      });
  }

  getPollOptions(): void {
    this.pollService.getPollOptions()
       .subscribe(pollOptions => this.pollOptions = pollOptions);
  }

  onOptionChange(newValue) {
    let exist = false;
    for(let i=0; i<this.newPoll.options.length; ++i) {
      if(newValue === this.newPoll.options[i].name) {
        exist = true;
        break;
      }
    }
    if(!exist)
      this.newPoll.options.push(new PollOption(newValue));
  }

  createPoll() {
    this.pollService.updatePoll(this.newPoll);
    this.resetPoll();
  }

  resetPoll() {
    this.newPoll = new Poll();
    this.newOption = "";
  }

  updateVote(option) {
    let index = option.votes.indexOf("Bill");
    if(index > -1)
      option.votes.splice(index, 1);
    else
      option.votes.push("Bill");

    this.pollService.updatePoll(this.poll);
  }

}
