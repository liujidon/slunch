import { Component, Input, OnInit } from '@angular/core';
import { PollOption } from '../poll-option';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-poll-option',
  templateUrl: './poll-option.component.html',
  styleUrls: ['./poll-option.component.css']
})
export class PollOptionComponent implements OnInit {
  @Input() pollOption: PollOption;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  myvote() {
      return this.pollOption.votes.includes(this.authService.getUsername());
  }


}
