import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authService: AuthService;
  router: Router;
  username: string;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if(this.authService.isLoggedIn()){
        this.username = this.authService.getUsername();
      }
      else{
        this.username = "";
      }
    });
  }

  viewUnprocessedTransactions(){
    this.router.navigate(["unprocessed"]);
  }

  logoClick(){
    this.router.navigate(["vote"]);
  }

}
