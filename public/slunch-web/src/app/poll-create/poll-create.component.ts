import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../providers/auth.service';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.css']
})
export class PollCreateComponent implements OnInit {

  newPoll: Poll;
  newOption: string;
  pollOptions$: Observable<PollOption[]>;

  constructor(public pollService: PollService, public authService: AuthService) {
    this.newPoll = new Poll("");
  }

  ngOnInit() {
    this.pollOptions$ = this.pollService.getPollOptions();
  }

  onOptionChange(po: PollOption) {
    let exist = false;
    for(let i=0; i<this.newPoll.options.length; ++i) {
      if(po.name === this.newPoll.options[i].name) {
        exist = true;
        break;
      }
    }
    if(!exist)
      this.newPoll.options.push(new PollOption(po.name, po.iconUrl, po.menuUrl));
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
