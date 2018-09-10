import {Injectable} from '@angular/core';
import {PollOption} from '../poll-option';
import {Poll} from '../poll';
import {AngularFirestore} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
import {environment} from '../../environments/environment';
import {StateFace} from '../interfaces';
import {GridOptions} from 'ag-grid';
import {GridImageComponent} from '../gridElements/grid-image/grid-image.component';
import {GridPollOptionControlComponent} from '../gridElements/grid-poll-option-control/grid-poll-option-control.component';
import {MatBottomSheet} from '@angular/material';
import {GridVoterStatusComponent} from "../gridElements/grid-voter-status/grid-voter-status.component";

@Injectable({
  providedIn: 'root'
})
export class PollService {

  pollOptions: Array<PollOption> = [];
  pollOptionsSubscription: Subscription;

  pollOptionsGO: GridOptions;

  votersOptions: Array<any> = [];
  votersGO: GridOptions;

  latestPollSubscription: Subscription;
  latestPoll: Poll;

  stateSubscription: Subscription;
  allowPoll: Boolean;

  currentVoters: Array<string> = [];

  newOptions: number = 0;

  constructor(public db: AngularFirestore,
              public authService: AuthService,
              public bottomSheetService: MatBottomSheet) {

    this.pollOptionsGO = {
      onGridReady: (params) => {
        this.pollOptionsGO.api = params.api;
        this.pollOptionsGO.columnApi = params.columnApi;
        this.pollOptionsGO.api.setRowData(this.pollOptions);
      },
      rowHeight: 120,
      columnDefs: [
        {headerName: "Name", field: "name", sort: "asc"},
        {
          headerName: "Icon",
          cellRendererFramework: GridImageComponent,
          width: 150,
          suppressFilter: true,
          suppressSorting: true,
          suppressResize: true
        },
        {
          headerName: "Edit",
          cellRendererFramework: GridPollOptionControlComponent,
          cellRendererParams: {
            pollService: this,
            bottomSheetService: this.bottomSheetService
          },
          suppressFilter: true,
          suppressSorting: true,
          suppressResize: true
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowClassRules: {
        "lightred-background": (params) => params.data.menuUrl == "http://www.google.com" || params.data.iconUrl == environment.defaultIconUrl
      }
    }

    this.votersGO = {
      onGridReady: (params) => {
        this.votersGO.api = params.api;
        this.votersGO.columnApi = params.columnApi;
        this.votersGO.api.setRowData(this.voterListOptions());
        this.votersGO.columnApi.autoSizeAllColumns();
      },
      rowHeight: 40,
      columnDefs: [
        {headerName: "Voter's Name", field: "name", sort: "asc"},
        {headerName: "Chosen Retauarants", field: "restaurants", sort: "asc"},
        {
          headerName: "Ordered?",
          cellRendererFramework: GridVoterStatusComponent,
          suppressSorting: true, suppressFilter: true, suppressResize: true
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowClassRules: {
        "lightred-background": (params) => params.data.menuUrl == "http://www.google.com" || params.data.iconUrl == environment.defaultIconUrl
      }
    }

  }

  subscribe() {
    console.log("PollService latestPollSubscription subscribing");
    this.latestPollSubscription = this.db.collection<Poll>('poll', ref => ref.orderBy('createtime', 'desc').limit(1)).valueChanges().subscribe(pollArray => {
      this.latestPoll = pollArray[0];

      this.currentVoters = []
      this.latestPoll.options.forEach(po => {
        po.votes.forEach(name => {
          if (this.currentVoters.indexOf(name) == -1) this.currentVoters.push(name);
        });
      });
      this.currentVoters = this.currentVoters.sort((a, b) => a.toLowerCase() <= b.toLowerCase() ? -1 : 1);
      if (this.votersGO.api) this.votersGO.api.setRowData(this.voterListOptions());
    });

    console.log("PollService pollOptionsSubscription subscribing");
    this.pollOptionsSubscription = this.db.collection<PollOption>('poll-options').snapshotChanges().subscribe(docChangeActions => {

      this.pollOptions = docChangeActions.map(docChangeAction => {
        let doc: any = docChangeAction.payload.doc;
        let po = doc.data();
        po.id = doc.id;
        return po;
      }, PollOption);
      if (this.pollOptionsGO.api) this.pollOptionsGO.api.setRowData(this.pollOptions);

      this.newOptions = this.pollOptions.filter((po) => po.menuUrl == "http://www.google.com" || po.iconUrl == environment.defaultIconUrl).length;

    });

    console.log("PollService stateSubscription subscribing");
    this.stateSubscription = this.db.doc<StateFace>(environment.stateRef).valueChanges().subscribe(state => {
      this.allowPoll = state.allowPoll;
    });

  }

  unsubscribe() {
    if (this.latestPollSubscription) {
      console.log("PollService latestPollSubscription unsubscribing");
      this.latestPollSubscription.unsubscribe();
    }

    if (this.pollOptionsSubscription) {
      console.log("PollService pollOptionsSubscription unsubscribing");
      this.pollOptionsSubscription.unsubscribe();
    }

    if (this.stateSubscription) {
      console.log("PollService stateSubscription unsubscribing");
      this.stateSubscription.unsubscribe();
    }

  }

  getAdminSelectedOptions() {
    if (this.latestPoll) {
      return this.latestPoll.options.filter(po => po.uidVotes.filter(uid => this.authService.adminUids.includes(uid)).length > 0);
    }
    else {
      return [];
    }

  }

  updatePoll(poll: Poll) {
    if (poll.id == null)
      poll.id = this.db.createId();
    this.db.collection<Poll>('poll').doc(poll.id).set(JSON.parse(JSON.stringify(poll)));
  }


  updatePollOption(po: PollOption) {
    this.db.doc("poll-options/" + po.id).update(po);
  }

  writePollOption(name: string) {
    let po: any;
    let id: string = this.db.createId();
    po = {
      name: name,
      iconUrl: environment.defaultIconUrl,
      menuUrl: "http://www.google.com",
      id: id
    }
    this.db.collection<PollOption>("poll-options").doc(id).set(JSON.parse(JSON.stringify(po)));
  }

  deletePollOption(po: PollOption) {
    this.db.doc("poll-options/" + po.id).delete();
  }

  liked(name): Array<string> {
    return this.latestPoll.options.filter(po => po.votes.includes(name)).map(po => po.name);
  }

  voterListOptions(): Array<any> {
    var finalList = []
    for (var i = 0; i < this.currentVoters.length; i++) {
      var dataPoint = {};
      var likedRestaurants = this.liked(this.currentVoters[i]);
      var likedRestaurantsString = '';
      for (var k = 0; k < likedRestaurants.length; k++) {
        if (k === likedRestaurants.length - 1) {
          likedRestaurantsString += likedRestaurants[k];
        }
        else{
          likedRestaurantsString += likedRestaurants[k] + ", ";
        }
      }
      dataPoint["name"] = this.currentVoters[i];
      dataPoint["restaurants"] = likedRestaurantsString;
      dataPoint["status"] = "Not Ordered"
      finalList.push(dataPoint);
    }
    this.votersOptions = finalList
    return finalList;
  }

  getVoterList(): Array<any>{
    return this.votersOptions;
  }

  setVoterOptions(votersOptions: Array<any>){
    this.votersOptions = votersOptions;
    if (this.votersGO.api) this.votersGO.api.setRowData(this.votersOptions);
  }
}
