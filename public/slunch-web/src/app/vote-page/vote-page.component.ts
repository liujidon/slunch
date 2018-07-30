import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {

  @Input() newPollToggled: boolean;
  authService: AuthService;
  stateService: StateService;
  state: StateFace;
  isOrdering: boolean;

  constructor(authService: AuthService, stateService: StateService) {
    this.authService = authService;
    this.stateService = stateService;
  }

  ngOnInit() {
    this.stateService.getState$().subscribe((state)=>{
      this.state = state;
      this.isOrdering = state.allowOrders;
    });
    this.newPollToggled = false;
  }

  toggleOrders(){
    if(this.state.allowOrders){
      this.stateService.setState({
        allowOrders: false,
        allowPoll: true
      });
    }
    else{
      this.stateService.setState({
        allowOrders: true,
        allowPoll: false
      });
    }
  }



}
