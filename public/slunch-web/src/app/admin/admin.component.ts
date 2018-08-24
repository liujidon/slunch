import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { AdminService } from '../providers/admin.service';
import { PollService } from '../providers/poll.service';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  optionColumns: Array<string> = [
    "name", "icon", "iconUrl", "menuUrl", "refresh", "delete"
  ];

  @ViewChild("optionPaginator") optionPaginator: MatPaginator;

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

    if (this.pollService.pollOptionsDS) {
      this.pollService.pollOptionsDS.paginator = this.optionPaginator;
    }

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
