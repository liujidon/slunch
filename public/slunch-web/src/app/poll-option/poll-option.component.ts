import { Component, Input, OnInit } from '@angular/core';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-poll-option',
  templateUrl: './poll-option.component.html',
  styleUrls: ['./poll-option.component.css']
})
export class PollOptionComponent implements OnInit {
  @Input() pollOption: PollOption;

  constructor() { }

  ngOnInit() {
  }

}
