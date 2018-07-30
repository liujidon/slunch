import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        //this.router.navigate(['vote'])
      })
      .catch((err) => console.log(err));
  }

  signInWithEmail() {
    this.authService.signInRegular(this.user.email, this.user.password)
      .then((res) => {
        console.log(res);
        //this.router.navigate(['vote']);
      })
      .catch((err) => console.log('error: ' + err));
  }

  signUpWithEmail() {
    this.authService.signUpRegular(this.user.email, this.user.password)
      .then((res) => {
        console.log(res);
      //  this.router.navigate(['vote']);
      })
      .catch((err) => console.log('error: ' + err));
  }

}
