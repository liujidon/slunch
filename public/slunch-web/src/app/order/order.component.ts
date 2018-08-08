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
export class OrderComponent implements OnInit, OnDestroy {

  router: Router;
  pollService: PollService;
  authService: AuthService;
  chosenOptions: Array<PollOption>;
  chosenOption: PollOption;
  transactionService: TransactionService;
  order: string;
  isRestaurantChosen: boolean;
  isOrderSent: boolean;
  recentOrders: Array<string>;
  @ViewChild("stepper") stepper: MatStepper;

  latestPollSubscription: Subscription;
  adminSubscription: Subscription;


  constructor(pollService: PollService, authService: AuthService, transactionService: TransactionService, router: Router) {
    this.pollService = pollService;
    this.authService = authService;
    this.chosenOptions = [];
    this.transactionService = transactionService;
    this.order = "";
    this.isRestaurantChosen = false;
    this.isOrderSent = false;
    this.recentOrders = [];
    this.router = router;

  }

  ngOnInit() {
    this.latestPollSubscription = this.pollService.getLatestPoll().subscribe(
      (poll:Array<PollFace>)=>{
        if(poll){
          this.adminSubscription = this.authService.getAdmins$().subscribe((admin) => {
            poll[0].options.forEach(
              (po:PollOption)=>{
                if(po.uidVotes.filter(uid =>  admin["uids"].includes(uid)).length > 0){
                  this.chosenOptions.push(po);
                }
              }
            );
          },()=>console.log("ERROR: OrderComponent line 49"));
          
        }
      }
    ), ()=>console.log("ERROR: OrderComponent line 46");


  }

  ngOnDestroy(){
    console.log("OrderComponent unsubscribing")
    this.latestPollSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

  clickRestaurant(option: PollOption, stepper: MatStepper){
    this.order = "";
    this.isOrderSent = false;
    this.chosenOption = option;
    this.isRestaurantChosen = true;

    let transactionSubscription: Subscription = this.transactionService.getTransactions$().subscribe((transactions)=>{
      let temp: Array<string> = [];
      transactions
        .filter((transaction)=> transaction.uid == this.authService.getUid() && transaction.description == this.chosenOption.name)
        .forEach(transaction=>{
          if(temp.indexOf(transaction.detail) === -1){
            temp.push(transaction.detail);
          }
        });
        this.recentOrders = temp;
    });
    
    stepper.next();

    transactionSubscription.unsubscribe();
  }

  clickSendOrder(stepper: MatStepper){
    this.transactionService.writeTransaction(this.authService.getUid(), this.chosenOption.name, this.order, 0, false);
    this.isOrderSent = true;
    stepper.next();
    this.isRestaurantChosen = false;
  }





}
