import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';
import { Subscription } from '../../../node_modules/rxjs';
import { ServiceHandlerService } from '../providers/service-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authService: AuthService;
  stateService: StateService;
  transactionService: TransactionService;
  state: StateFace;
  isOrdering: boolean;
  @Input() newPollToggled: boolean;
  
  router: Router;
  username: string;

  constructor(
    private serviceHandlerService: ServiceHandlerService,
    authService: AuthService,
    transactionService: TransactionService,
    stateService: StateService,
    router: Router
  ) {
    this.authService = authService;
    this.router = router;
    this.stateService = stateService;
    this.transactionService = transactionService;
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

  logout(){
    this.serviceHandlerService.unsubscribe();
    this.authService.logout();
  }

}
