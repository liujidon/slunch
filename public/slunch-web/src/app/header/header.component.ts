import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authService: AuthService;
  stateService: StateService;
  state: StateFace;
  isOrdering: boolean;
  @Input() newPollToggled: boolean;
  
  router: Router;
  username: string;

  constructor(authService: AuthService, stateService: StateService, router: Router) {
    this.authService = authService;
    this.router = router;
    this.stateService = stateService;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if(this.authService.isLoggedIn()){
        this.username = this.authService.getUsername();
      }
      else{
        this.username = "";
      }
    });

  }

  viewUnprocessedTransactions(){
    this.router.navigate(["unprocessed"]);
  }

  toggleOrders(){
    if(this.stateService.state.allowOrders){
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

  logoClick(){
    this.router.navigate(["vote"]);
  }

}
