import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { AdminFace } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  public isAdmin: boolean = false;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router, db: AngularFirestore) {
    this.user = firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          db.doc("admin/awZQPDtQrd1P3AdCw0It").valueChanges().subscribe(
            (doc: AdminFace)=>{
              if(doc){
                this.isAdmin = doc.uids.includes(this.userDetails.uid);
              }
            }
          )
          console.log(this.userDetails);          
          this.router.navigate(['vote']);
        } else {
          this.userDetails = null;
        }
      }
    );

  }

  getUsername() {
    if(this.userDetails.displayName != null)
      return this.userDetails.displayName;
    else
      return this.userDetails.email;
  }

  getUid(){
    return this.userDetails.uid;
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
    this.firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
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
