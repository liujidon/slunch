import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '../providers/state.service';
import { PollService } from '../providers/poll.service';

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
    public pollService: PollService
  ) {}



  ngOnInit() {
    
  }
  
  sendSuggestion(){
    this.pollService.writePollOption(this.newOption);
    this.newOption = "";
    this.sentSuggestions = this.sentSuggestions + 1;
  }



}
