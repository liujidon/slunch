import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '../providers/state.service';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {

  stateService: StateService;

  constructor(stateService: StateService) {
    this.stateService = stateService;
  }

  ngOnInit() {
    
  }

  



}
