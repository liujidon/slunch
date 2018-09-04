import { Component, Inject, OnDestroy } from '@angular/core';
import { PollOption } from '../poll-option';
import { PollService } from '../providers/poll.service';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-poll-option',
  templateUrl: './edit-poll-option.component.html',
  styleUrls: ['./edit-poll-option.component.css']
})
export class EditPollOptionComponent implements OnDestroy {

  pollService: PollService;
  po: PollOption;
  backDropSubscription: Subscription;

  origMenuUrl: string;
  origIconUrl: string;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<EditPollOptionComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data
  ) {
    this.po = data.po;
    this.pollService = data.pollService;

    this.origMenuUrl = data.po.menuUrl;
    this.origIconUrl = data.po.iconUrl;

    this.backDropSubscription = this.bottomSheetRef.backdropClick().subscribe(() => {
      this.po.menuUrl = this.origMenuUrl;
      this.po.iconUrl = this.origIconUrl;
    });

  }

  ngOnDestroy() {
    this.backDropSubscription.unsubscribe();
  }


  updatePollOption(po: PollOption) {
    this.pollService.updatePollOption(po);
  }

  deletePollOption(po: PollOption) {
    this.pollService.deletePollOption(po);
    this.bottomSheetRef.dismiss();
  }

  close() {
    this.po.menuUrl = this.origMenuUrl;
    this.po.iconUrl = this.origIconUrl;
    this.bottomSheetRef.dismiss();
  }

}
