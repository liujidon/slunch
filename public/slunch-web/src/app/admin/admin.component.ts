import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  price: string;
  displayedColumns: Array<string> = [
    "time", "name", "description", "detail", 
    "price", "status", "acknowledge", "ordered", "confirm"
  ];

  constructor(
    public transactionService: TransactionService,
    public stateService: StateService,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  backClick(){
    this.router.navigate(["vote"]);
  }

  confirmTransaction(t: Transaction){
    let p: any = t.price;
    if(t.isDeposit){
      p = -parseFloat(p);
    }
    else{
      p = parseFloat(p);
    }
    let data = {
      status: "done",
      price: p,
      completedBy: this.authService.getUsername()
    };
    this.transactionService.updateTransaction(t, data);
  }

  confirmOrdered(t: Transaction){
    let data = {
      status: "ordered",
      orderedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

  acknowledgeTransaction(t: Transaction){
    let data = {
      status: "ack",
      ackedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

}
