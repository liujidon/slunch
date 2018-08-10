import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PollService } from '../providers/poll.service';
import { AuthService } from '../providers/auth.service';
import { PollFace } from '../interfaces';
import { PollOption } from '../poll-option';
import { MatStepper } from '@angular/material';
import { TransactionService } from '../providers/transaction.service';
import { Transaction } from '../transaction';
import { Router } from '../../../node_modules/@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  chosenOptions: Array<PollOption>;
  chosenOption: PollOption;
  order: string;
  isRestaurantChosen: boolean;
  isOrderSent: boolean;
  recentOrders: Array<string>;
  @ViewChild("stepper") stepper: MatStepper;

  constructor(
    public pollService: PollService,
    public authService: AuthService,
    public transactionService: TransactionService,
    public router: Router
  ) {
    this.order = "";
    this.isRestaurantChosen = false;
    this.isOrderSent = false;
    this.recentOrders = [];
  }

  ngOnInit() {

  }

  clickRestaurant(option: PollOption, stepper: MatStepper){
    this.order = "";
    this.isOrderSent = false;
    this.chosenOption = option;
    this.isRestaurantChosen = true;
    this.recentOrders = this.transactionService.getRecentOrders(this.chosenOption.name);
    stepper.next();
  }

  clickSendOrder(stepper: MatStepper){
    this.transactionService.writeTransaction(this.authService.getUid(), this.chosenOption.name, this.order, 0, false);
    this.isOrderSent = true;
    stepper.next();
    this.isRestaurantChosen = false;
  }





}
