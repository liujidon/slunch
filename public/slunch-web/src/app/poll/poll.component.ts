import { Component, OnInit } from '@angular/core';
import { PollOption } from '../poll-option';
import { PollService } from '../providers/poll.service';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {

  constructor(public pollService: PollService, public authService: AuthService) {
  }

  ngOnInit() {
  }


  updateVote(option: PollOption) {
    let uid = this.authService.getUid();
    let name = this.authService.getUsername();

    let uidIndex = option.uidVotes.indexOf(uid);
    let nameIndex = option.votes.indexOf(name);

    if(nameIndex > -1)
      option.votes.splice(nameIndex, 1);
    else
      option.votes.push(name);

    if(uidIndex > -1)
      option.uidVotes.splice(uidIndex, 1);
    else
      option.uidVotes.push(uid);

    this.pollService.updatePoll(this.pollService.latestPoll);

    this.pollService.updateVoteStatus(this.authService.getID(), "Not Ordered");
  }

  orderStatus() {
    var voteStatus = this.authService.getVoteStatus()
    if (voteStatus == "Not Ordered" || voteStatus == "Not Voted") {
      document.getElementById("pollCard").style.display = 'none';
      document.getElementById("pollStatusButton").innerHTML = "I'm In!"
      this.pollService.updateVoteStatus(this.authService.getID(), "Not Ordering");
    }
    else if (voteStatus == "Not Ordering") {
      document.getElementById("pollCard").style.display = 'block';
      document.getElementById("pollStatusButton").innerHTML = "I'm Out!"
      this.pollService.updateVoteStatus(this.authService.getID(), this.authService.checkIfNoVotes());
    }
  }

}
