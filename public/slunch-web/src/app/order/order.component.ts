import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../providers/auth.service';
import { PollFace } from '../interfaces';
import { PollOption } from '../poll-option';
import { MatStepper } from '@angular/material';
import { TransactionService } from '../providers/transaction.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  pollService: PollService;
  authService: AuthService;
  chosenOptions: Array<PollOption>;
  chosenOption: PollOption;
  transactionService: TransactionService;
  order: string;
  isRestaurantChosen: boolean;
  isOrderSent: boolean;
  @ViewChild("stepper") stepper: MatStepper;


  constructor(pollService: PollService, authService: AuthService, transactionService: TransactionService) {
    this.pollService = pollService;
    this.authService = authService;
    this.chosenOptions = [];
    this.transactionService = transactionService;
    this.order = "";
    this.isRestaurantChosen = false;
    this.isOrderSent = false;

  }

  ngOnInit() {
    this.pollService.getLatestPoll().subscribe(
      (poll:Array<PollFace>)=>{
        if(poll){
          if(this.authService.isAdmin){
            poll[0].options.forEach(
              (po:PollOption)=>{
                if(po.uidVotes.includes(this.authService.getUid())){
                  this.chosenOptions.push(po);
                }
              }
            );
          }
        }
      }
    );


  }

  clickRestaurant(option: PollOption, stepper: MatStepper){
    this.order = "";
    this.isOrderSent = false;
    this.chosenOption = option;
    this.isRestaurantChosen = true;
    stepper.next();
  }

  clickSendOrder(stepper: MatStepper){
    this.transactionService.writeTransaction(this.authService.getUid(), this.order, this.chosenOption.name);
    this.isOrderSent = true;
    stepper.next();
    this.isRestaurantChosen = false;
  }





}
