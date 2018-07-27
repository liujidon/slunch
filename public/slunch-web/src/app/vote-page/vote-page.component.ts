import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { StateService } from '../providers/state.service';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {
  title = 'Slunch';
  username = '';
  orderToggled: true;
  newPollToggled: true;
  authService: AuthService;
  stateService: StateService;

  constructor(authService: AuthService, stateService: StateService) {
    this.authService = authService;
    this.stateService = stateService;
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    if(this.authService.isAdmin()){
      this.toggleOrders();
    }
  }

  toggleOrders(){
    if(this.orderToggled){
      this.stateService.setState({
        allowOrders: true,
        allowPoll: false
      });
    }
    else{
      this.stateService.setState({
        allowOrders: false,
        allowPoll: true
      });
    }
  }

}
