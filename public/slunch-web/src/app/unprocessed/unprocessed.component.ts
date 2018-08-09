import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TransactionService } from '../providers/transaction.service';
import { Transaction } from '../transaction';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '../../../node_modules/@angular/router';
import { StateService } from '../providers/state.service';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-unprocessed',
  templateUrl: './unprocessed.component.html',
  styleUrls: ['./unprocessed.component.css']
})
export class UnprocessedComponent implements OnInit {

  transactionService: TransactionService;
  stateService: StateService;
  authService: AuthService;
  router: Router;
  db: AngularFirestore;
  price: string;
  displayedColumns: Array<string> = [
    "time", "name", "description", "detail", 
    "price", "status", "acknowledge", "confirm"
  ];

  constructor(transactionService: TransactionService, stateService: StateService, authService: AuthService, db: AngularFirestore, router: Router) {
    this.transactionService = transactionService;
    this.stateService = stateService;
    this.authService = authService;
    this.router = router;
    this.db = db;
  }

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

  acknowledgeTransaction(t: Transaction){
    let data = {
      status: "ack",
      ackedBy: this.authService.getUsername()
    }
    this.transactionService.updateTransaction(t, data);
  }

}
