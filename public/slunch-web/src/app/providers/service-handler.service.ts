import {Injectable} from '@angular/core';
import {StateService} from './state.service';
import {AuthService} from './auth.service';
import {TransactionService} from './transaction.service';
import {PollService} from './poll.service';
import {AdminService} from './admin.service';
import {AccountService} from './account.service';
import {PastOrderService} from './past-order.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceHandlerService {

  subscribed: boolean = false;

  constructor(private authService: AuthService,
              private stateService: StateService,
              private transactionService: TransactionService,
              private pollService: PollService,
              private adminService: AdminService,
              private pastOrderService: PastOrderService,
              private accountService: AccountService) {
  }

  subscribe() {
    this.subscribed = true;
    this.authService.subscribe();
    this.stateService.subscribe();
    this.transactionService.subscribe();
    this.pollService.subscribe();
    this.adminService.subscribe();
    this.pastOrderService.subscribe();
  }

  unsubscribe() {
    this.subscribed = false;
    this.authService.unsubscribe();
    this.stateService.unsubscribe();
    this.transactionService.unsubscribe();
    this.pollService.unsubscribe();
    this.adminService.unsubscribe();
    this.pastOrderService.unsubscribe();
    this.accountService.unsubscribe();
  }

}
