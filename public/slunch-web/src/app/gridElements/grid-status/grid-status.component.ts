import { Component } from '@angular/core';

@Component({
  selector: 'app-grid-status',
  templateUrl: './grid-status.component.html',
  styleUrls: ['./grid-status.component.css']
})
export class GridStatusComponent {

  o: any;

  agInit(params) {
    this.o = params.data;
  }

}
