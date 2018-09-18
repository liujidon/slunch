import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore} from 'angularfire2/firestore';
import {AdminFace, AccountFace} from '../interfaces';
import {Subscription} from 'rxjs';

import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  public admins$: Observable<Array<string>>;
  public db: AngularFirestore;

  public isAdmin: boolean = false;
  public adminUids: Array<string>;
  public account: any;

  private adminSubscription: Subscription;
  private accountsSubscription: Subscription;
  private accountsVoteSubscription: Subscription;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router, db: AngularFirestore) {
    this.db = db;
    this.user = firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this.router.navigate(['vote']);
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  subscribe() {

    console.log("AuthService adminSubscription subscribing");
    this.adminSubscription = this.db.doc(environment.adminRef).valueChanges().subscribe(
      (doc: AdminFace) => {
        if (doc) {
          this.isAdmin = doc.uids.includes(this.getUid());
          this.adminUids = doc.uids;
        }
      }
    );

    console.log("AuthService accountsSubscription subscribing")
    this.accountsSubscription = this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      docChangeActions => {

        let temp = docChangeActions.filter(docChangeAction => docChangeAction.payload.doc.get("uid") == this.getUid())
        if (temp.length > 0) {
          let accountDoc = temp[0].payload.doc;
          this.account = accountDoc.data();
          this.account.id = accountDoc.id;
        }
      }
    );
  }

  unsubscribe() {
    if (this.adminSubscription) {
      console.log("AuthService adminSubscription unsubscribing");
      this.adminSubscription.unsubscribe();
    }

    if (this.accountsSubscription) {
      console.log("AuthService accountsSubscription unsubscribing");
      this.accountsSubscription.unsubscribe();
    }

  }

  getUsername() {
    if (this.userDetails) {
      if (this.userDetails.displayName != null)
        return this.userDetails.displayName;
      else
        return this.userDetails.email;
    }
    else {
      return "";
    }
  }

  getUid() {
    if (this.userDetails) {
      return this.userDetails.uid;
    }
    else {
      return null;
    }
  }

  getID(){
    if (this.account) {
      return this.account.id;
    }
    else {
      return null;
    }
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut().then((res) => this.router.navigate(['/']));
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  signInWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }
}
