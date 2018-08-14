import { Component, OnInit, ViewChild } from '@angular/core';
import { PollService } from '../providers/poll.service';
import { AuthService } from '../providers/auth.service';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';
import { Router } from '@angular/router';
import { StateService } from '../providers/state.service';

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.css']
})
export class PollCreateComponent implements OnInit {

  newPoll: Poll;
  selectedOptions: Array<PollOption> = [];

  constructor(public pollService: PollService, public stateService: StateService, public authService: AuthService, public router: Router) {
    this.newPoll = new Poll("");
  }

  ngOnInit() {
  }

  createPoll() {
    
    this.newPoll.options = this.selectedOptions.map(so=>{
      so.uidVotes = [];
      so.votes = [];
      return so;
    })
    this.pollService.updatePoll(this.newPoll);

    // Turn off ordering
    this.stateService.setState({
      allowOrders: false
    });
    
    this.router.navigate(['vote']);
  }

}
