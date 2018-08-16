import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AccountFace } from '../interfaces';
import { Subscription } from '../../../node_modules/rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  accounts: Array<AccountFace>;
  accountsSubscription: Subscription;

  constructor(public authService: AuthService, public db:AngularFirestore) { }

  subscribe(){
    console.log("AdminService accountSubscription subscribing");
    this.accountsSubscription = this.db.collection<AccountFace>("accounts").valueChanges().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  unsubscribe(){
    console.log("AdminService accountsSubscription unsubscribing");
    this.accountsSubscription.unsubscribe();

  }




}
