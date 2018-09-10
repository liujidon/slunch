import { Component } from '@angular/core';

@Component({
  selector: 'app-grid-voter-status',
  templateUrl: './grid-voter-status.component.html',
  styleUrls: ['./grid-voter-status.component.css']
})
export class GridVoterStatusComponent {

  o: any;

  agInit(params) {
    this.o = params.data;
  }

}
