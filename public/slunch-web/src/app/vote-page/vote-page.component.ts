import {Component, OnInit, AfterViewInit} from '@angular/core';
import {StateService} from '../providers/state.service';
import {PollService} from '../providers/poll.service';
import {AuthService} from '../providers/auth.service';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class VotePageComponent implements OnInit, AfterViewInit {
  authService: AuthService;
  newOption: string = "";
  sentSuggestions: number = 0;

  screenWidth: number = window.innerWidth;

  constructor(public stateService: StateService,
              public pollService: PollService,
              authService: AuthService) {
    this.authService = authService;
  }


  ngOnInit() {
  }

  ngAfterViewInit(){
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.authService.isAdmin) {
      if (window.innerWidth < 480) {
        this.pollService.suggestionsGO.columnApi.autoSizeAllColumns();
        this.pollService.votersGO.columnApi.autoSizeAllColumns();
      }
      else {
        this.pollService.suggestionsGO.api.sizeColumnsToFit();
        this.pollService.votersGO.api.sizeColumnsToFit();

      }
    }
  }

  sendSuggestion() {
    this.pollService.writePollOption(this.newOption);
    this.newOption = "";
    this.sentSuggestions = this.sentSuggestions + 1;
  }


  toggleOrders() {
    if (this.pollService.getAdminSelectedOptions().length > 0) {
      if (this.stateService.state.allowOrders) {
        this.stateService.setState({
          allowOrders: false
        });
      }
      else {
        this.stateService.setState({
          allowOrders: true
        });
      }
    }
  }

  togglePoll() {
    if (!this.stateService.isOrdering) {
      if (this.pollService.allowPoll) {
        this.stateService.setState({
          allowPoll: false
        });
      }
      else {
        this.stateService.setState({
          allowPoll: true
        });
      }
    }
  }

}
