import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { StateService } from '../providers/state.service';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css']
})
export class VotePageComponent implements OnInit {
  title = 'Slunch';
  username = '';
  authService: AuthService;
  stateService: StateService;

  constructor(authService: AuthService, stateService: StateService) {
    this.authService = authService;
    this.stateService = stateService;
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

}
