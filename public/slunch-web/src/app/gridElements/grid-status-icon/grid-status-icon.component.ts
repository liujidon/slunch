import { Component } from '@angular/core';
import { Transaction } from '../../transaction';

@Component({
  selector: 'app-grid-status-icon',
  templateUrl: './grid-status-icon.component.html',
  styleUrls: ['./grid-status-icon.component.css']
})
export class GridStatusIconComponent {

  o: any;
  
  agInit(params){
    this.o = params.data;
  }

}
