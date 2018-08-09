import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';
import { PollService } from './poll.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceHandlerService {

  authService: AuthService;
  stateService: StateService;
  transactionService: TransactionService;
  pollService: PollService;
  subscribed: boolean = false;

  constructor(
    authService: AuthService,
    stateService: StateService,
    transactionService: TransactionService,
    pollService: PollService
  ) {
    this.authService = authService;
    this.stateService = stateService;
    this.transactionService = transactionService;
    this.pollService = pollService;
  }

  subscribe(){
    this.subscribed = true;
    this.authService.subscribe();
    this.stateService.subscribe();
    this.transactionService.subscribe();
    this.pollService.subscribe();
  }

  unsubscribe(){
    this.subscribed = false;
    this.authService.unsubscribe();
    this.stateService.unsubscribe();
    this.transactionService.unsubscribe();
    this.pollService.unsubscribe();
  }

}
