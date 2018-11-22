import {Component, OnInit, Input} from '@angular/core';
import {AuthService} from '../providers/auth.service';
import {Router} from '@angular/router';
import {StateService} from '../providers/state.service';
import {StateFace} from '../interfaces';
import {TransactionService} from '../providers/transaction.service';
import {ServiceHandlerService} from '../providers/service-handler.service';
import {PollService} from '../providers/poll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  state: StateFace;
  isOrdering: boolean;
  username: string;

  constructor(private serviceHandlerService: ServiceHandlerService,
              public authService: AuthService,
              public transactionService: TransactionService,
              public stateService: StateService,
              public router: Router,
              public pollService: PollService) {
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.username = this.authService.getUsername();
      }
      else {
        this.username = "";
      }
    });

    if (!this.serviceHandlerService.subscribed) {
      this.serviceHandlerService.subscribe();
    }

  }

  logoClick() {
    this.router.navigate(["vote"]);
  }

  logout() {
    this.serviceHandlerService.unsubscribe();
    this.authService.logout();
  }

  resetDateAndNavigate(page) {
    var date = new Date();
    if (date.getDay() === 1 || date.getDay() === 2 || date.getDay() === 3) {
      date.setDate(date.getDate() - 7);
    }
    else {
      date.setDate(date.getDate() - 3);
    }
    date.setHours(4); // Because database times are in GMT
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    this.transactionService.setDateLB(date);
    this.router.navigate([page])
  }

}
