import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { StateService } from '../providers/state.service';
import { StateFace } from '../interfaces';
import { TransactionService } from '../providers/transaction.service';

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
  numUnprocessed: number;
  
  router: Router;
  username: string;

  constructor(authService: AuthService, transactionService: TransactionService, stateService: StateService, router: Router) {
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

    this.transactionService.getTransactions$().subscribe((transactions)=>{
      this.numUnprocessed = transactions.filter(transaction=>transaction.status != "done").length;
    }, ()=>console.log("ERROR: HeaderComponent line 43"));

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
