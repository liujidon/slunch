import { Component } from '@angular/core';
import { PollService } from '../../providers/poll.service';
import { PollOption } from '../../poll-option';
import { MatBottomSheet } from '@angular/material';
import { EditPollOptionComponent } from '../../edit-poll-option/edit-poll-option.component';

@Component({
  selector: 'app-grid-poll-option-control',
  templateUrl: './grid-poll-option-control.component.html',
  styleUrls: ['./grid-poll-option-control.component.css']
})
export class GridPollOptionControlComponent {

  po: PollOption;
  pollService: PollService;
  bottomSheetService: MatBottomSheet;

  agInit(params){
    this.po = params.data;
    this.pollService = params.pollService;
    this.bottomSheetService = params.bottomSheetService;
  }

  editPollOption(){
    let data = {
      po: this.po,
      pollService: this.pollService
    }
    this.bottomSheetService.open(EditPollOptionComponent, {data: data});
  }



}
