import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {
  title = 'Slunch';
  username = '';
  orderToggled: boolean;
  @Input() newPollToggled: boolean;
  authService: AuthService;
  stateService: StateService;

  constructor(authService: AuthService, stateService: StateService) {
    this.authService = authService;
    this.stateService = stateService;
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.stateService.getStateObservable().subscribe(
      (state:StateFace)=>{this.orderToggled = state.allowOrders;}
    );
  }

  setNewOrderToggle(b: boolean){
    this.newPollToggled = b;
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
