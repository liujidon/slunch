import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import {PollService} from '../providers/poll.service';
import {AuthService} from '../providers/auth.service';
import {PollOption} from '../poll-option';
import {MatStepper} from '@angular/material';
import {TransactionService} from '../providers/transaction.service';
import {Router} from '@angular/router';
import {AccountService} from '../providers/account.service'


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
  popularOrders: Array<string>;
  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild("orderField") orderField: ElementRef;

  constructor(public pollService: PollService,
              public authService: AuthService,
              public transactionService: TransactionService,
              public accountService: AccountService,
              public router: Router) {
    this.order = "";
    this.isRestaurantChosen = false;
    this.isOrderSent = false;
    this.recentOrders = [];
    this.popularOrders = [];
  }

  ngOnInit() {
  }

  clickRestaurant(option: PollOption, stepper: MatStepper) {
    this.order = "";
    this.isOrderSent = false;
    this.chosenOption = option;
    this.isRestaurantChosen = true;
    this.recentOrders = this.accountService.getRecentOrders(this.chosenOption.name);
    this.popularOrders = this.transactionService.getPopularOrders(this.chosenOption.name);
    stepper.next();
    setTimeout(() => {
      this.orderField.nativeElement.focus();
    }, 200)
  }

  clickSendOrder(stepper: MatStepper) {
    this.transactionService.writeTransaction(this.authService.getUid(), this.chosenOption.name, this.order, 0, false);
    this.isOrderSent = true;
    stepper.next();
    this.isRestaurantChosen = false;
    this.pollService.updateVoteStatus(this.authService.getID(), "Have Ordered");
  }

  orderStatus() {
    var voteStatus = this.authService.getVoteStatus()
    if (voteStatus == "Not Ordered" || voteStatus == "Not Voted") {
      document.getElementById("orderCard").style.display = 'none';
      document.getElementById("orderStatusButton").innerHTML = "I'm In!"
      this.pollService.updateVoteStatus(this.authService.getID(), "Not Ordering");
    }
    else if (voteStatus == "Not Ordering") {
      document.getElementById("orderCard").style.display = 'block';
      document.getElementById("orderStatusButton").innerHTML = "I'm Out!"
      this.pollService.updateVoteStatus(this.authService.getID(), this.authService.checkIfNoVotes());
    }
  }

  enterSendOrder(event, stepper) {
    if (event.keyCode == 13 && this.authService.getVoteStatus() != 'Have Ordered' && this.order != "") {
      this.clickSendOrder(stepper);
    }
  }
}


