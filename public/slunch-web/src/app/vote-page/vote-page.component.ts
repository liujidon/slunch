import { Component, OnInit } from '@angular/core';
import { StateService } from '../providers/state.service';
import { PollService } from '../providers/poll.service';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {

  newOption: string = "";
  sentSuggestions: number = 0;

  constructor(
    public stateService: StateService,
    public pollService: PollService,
    public authService: AuthService
  ) {}



  ngOnInit() {
    
  }
  
  sendSuggestion(){
    this.pollService.writePollOption(this.newOption);
    this.newOption = "";
    this.sentSuggestions = this.sentSuggestions + 1;
  }

  
  toggleOrders() {
    if (this.pollService.getAdminSelectedOptions().length > 0 && this.pollService.allowPoll) {
      if (this.stateService.state.allowOrders) {
        this.stateService.setState({
          allowOrders: false
        });
      }
      else {
        this.stateService.setState({
          allowOrders: true
        });
      }
    }
  }

  togglePoll() {
    if (!this.stateService.isOrdering) {
      if (this.pollService.allowPoll) {
        this.stateService.setState({
          allowPoll: false
        });
      }
      else {
        this.stateService.setState({
          allowPoll: true
        });
      }
    }
  }



}
