import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '../providers/state.service';
import { ServiceHandlerService } from '../providers/service-handler.service';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {

  stateService: StateService;

  constructor(stateService: StateService, private serviceHandlerService: ServiceHandlerService) {
    this.stateService = stateService;
  }

  ngOnInit() {
    if(!this.serviceHandlerService.subscribed){
      this.serviceHandlerService.subscribe();
    }
  }

  



}
