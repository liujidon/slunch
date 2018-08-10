import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';
import { ServiceHandlerService } from '../providers/service-handler.service';
import { PollService } from '../providers/poll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  state: StateFace;
  isOrdering: boolean;
  @Input() newPollToggled: boolean;
  username: string;

  constructor(
    private serviceHandlerService: ServiceHandlerService,
    public authService: AuthService,
    public transactionService: TransactionService,
    public stateService: StateService,
    public router: Router,
    public pollService: PollService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      if(this.authService.isLoggedIn()){
        this.username = this.authService.getUsername();
      }
      else{
        this.username = "";
      }
    });

    if(!this.serviceHandlerService.subscribed){
      this.serviceHandlerService.subscribe();
    }

  }

  toggleOrders(){
    if(this.pollService.getAdminSelectedOptions().length > 0){
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
  }

  logoClick(){
    this.router.navigate(["vote"]);
  }

  logout(){
    this.serviceHandlerService.unsubscribe();
    this.authService.logout();
  }

}
