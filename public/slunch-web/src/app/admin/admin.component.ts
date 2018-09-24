import { Component, OnInit, Output } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../providers/admin.service';
import { PollService } from '../providers/poll.service';
import { PollOption } from '../poll-option';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  screenWidth: number = window.innerWidth;

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

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if(window.innerWidth < 480) {
      this.transactionService.doneGO.columnApi.autoSizeAllColumns();
      this.transactionService.unprocessedGO.columnApi.autoSizeAllColumns()
      this.adminService.accountsGO.columnApi.autoSizeAllColumns();
      this.pollService.pollOptionsGO.columnApi.autoSizeAllColumns();
    }
    else{
      this.transactionService.doneGO.api.sizeColumnsToFit();
      this.adminService.accountsGO.api.sizeColumnsToFit();
      this.pollService.pollOptionsGO.api.sizeColumnsToFit();

    }
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
