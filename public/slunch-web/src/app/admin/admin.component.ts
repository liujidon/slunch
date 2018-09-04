import { Component, OnInit, Output } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../providers/admin.service';
import { PollService } from '../providers/poll.service';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    public transactionService: TransactionService,
    public stateService: StateService,
    public authService: AuthService,
    public router: Router,
    public adminService: AdminService,
    public pollService: PollService
  ) {
  }

  ngOnInit() {

  }

  updatePollOption(po: PollOption) {
    this.pollService.updatePollOption(po);
  }

  deletePollOption(po: PollOption) {
    this.pollService.deletePollOption(po);
  }

  setDate(event){
    this.transactionService.setDateLB(new Date(event.value));
  }



}
