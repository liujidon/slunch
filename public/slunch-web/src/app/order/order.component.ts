import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../providers/auth.service';
import { PollFace } from '../interfaces';
import { PollOption } from '../poll-option';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  pollService: PollService;
  authService: AuthService;
  chosenOptions: Array<PollOption>;

  constructor(pollService: PollService, authService: AuthService) {
    this.pollService = pollService;
    this.authService = authService;
    this.chosenOptions = [];
  }

  ngOnInit() {
    this.pollService.getLatestPoll().subscribe(
      (poll:Array<PollFace>)=>{
        if(poll){
          if(this.authService.isAdmin){
            poll[0].options.forEach(
              (po:PollOption)=>{
                console.log(po.uidVotes);
                if(po.uidVotes.includes(this.authService.getUid())){
                  this.chosenOptions.push(po);
                }
              }
            );
          }
        }
      }
    );
  }





}
