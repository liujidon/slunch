import { Component, OnInit } from '@angular/core';
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

  getTodayPosition() {
    if (this.transactionService.todayTransactions) {
      return -1 * this.transactionService.todayTransactions.map(t => {
        if(t.status == "done"){
          return parseFloat(t.price+"");
        }
        else return 0;
      }).reduce((acc, v) => acc + v, 0);
    }
    else {
      return 0;
    }
  }

  getTotalBalance() {
    if (this.adminService.accounts) {
      return this.adminService.accounts.map(a => a.balance).reduce((acc, v) => acc + v, 0);
    }
    else {
      return 0;
    }
  }

  updatePollOption(po:PollOption){
    this.pollService.updatePollOption(po);
  }

  deletePollOption(po:PollOption){
    this.pollService.deletePollOption(po);
  }



}
