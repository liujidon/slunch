import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../providers/auth.service';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.css']
})
export class PollCreateComponent implements OnInit {

  newPoll: Poll;
  newOption: string;

  constructor(public pollService: PollService, public authService: AuthService) {
    this.newPoll = new Poll("");
  }

  ngOnInit() {
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
    this.newPoll = new Poll("");
    this.newOption = "";
  }

}
