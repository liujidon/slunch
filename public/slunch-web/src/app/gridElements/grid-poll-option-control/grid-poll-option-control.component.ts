import { Component, OnInit } from '@angular/core';
import { PollService } from '../../providers/poll.service';
import { PollOption } from '../../poll-option';

@Component({
  selector: 'app-grid-poll-option-control',
  templateUrl: './grid-poll-option-control.component.html',
  styleUrls: ['./grid-poll-option-control.component.css']
})
export class GridPollOptionControlComponent {

  po: PollOption;
  pollService: PollService;

  agInit(params){
    this.po = params.data;
    this.pollService = params.pollService;
  }

  updatePollOption(po:PollOption){
    this.pollService.updatePollOption(po);
  }

  deletePollOption(po:PollOption){
    this.pollService.deletePollOption(po);
  }

}
