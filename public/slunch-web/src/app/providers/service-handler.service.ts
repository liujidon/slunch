import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';
import { PollService } from './poll.service';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceHandlerService {

  subscribed: boolean = false;

  constructor(
    private authService: AuthService,
    private stateService: StateService,
    private transactionService: TransactionService,
    private pollService: PollService,
    private adminService: AdminService
  ) { }

  subscribe(){
    this.subscribed = true;
    this.authService.subscribe();
    this.stateService.subscribe();
    this.transactionService.subscribe();
    this.pollService.subscribe();
    this.adminService.subscribe();
  }

  unsubscribe(){
    this.subscribed = false;
    this.authService.unsubscribe();
    this.stateService.unsubscribe();
    this.transactionService.unsubscribe();
    this.pollService.unsubscribe();
    this.adminService.unsubscribe();
  }

}
