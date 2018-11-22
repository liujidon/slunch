import {Injectable} from '@angular/core';
import {PollOption} from '../poll-option';
import {Poll} from '../poll';
import {AngularFirestore, docChanges} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators'
import {environment} from '../../environments/environment';
import {StateFace, AccountFace} from '../interfaces';
import {GridOptions} from 'ag-grid';
import {GridImageComponent} from '../gridElements/grid-image/grid-image.component';
import {GridPollOptionControlComponent} from '../gridElements/grid-poll-option-control/grid-poll-option-control.component';
import {MatBottomSheet} from '@angular/material';
import {GridVoterStatusComponent} from "../gridElements/grid-voter-status/grid-voter-status.component";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  pollOptions: Array<PollOption> = [];
  pollOptionsSubscription: Subscription;

  pollOptionsGO: GridOptions;

  scotiaLat = 43.649479;
  scotiaLong = -79.379566;

  suggestionsGO: GridOptions;
  suggestionsOptionsGO: Array<object> = [];

  votersOptionsGO: Array<object> = [];
  votersGO: GridOptions;

  latestPollSubscription: Subscription;
  latestPoll: Poll;

  restaurantDistanceVotes: Object = {}
  restaurantCountVotes: Object = {};
  restaurantCountDistance: Object = {};

  stateSubscription: Subscription;
  allowPoll: Boolean;
  allowOrder: Boolean;

  currentVoters: Array<string> = [];
  currentUidVoters: Array<string> = [];
  currentVoteRestuarantNames: object = {};

  accountsPollSubscription: Subscription;
  accountsSubscription: Subscription;

  newOptions: number = 0;
  newPollCreated: boolean = false;


  constructor(public db: AngularFirestore,
              private http: HttpClient,
              public authService: AuthService,
              public bottomSheetService: MatBottomSheet) {
    this.pollOptionsGO = {
      onGridReady: (params) => {
        this.pollOptionsGO.api = params.api;
        this.pollOptionsGO.columnApi = params.columnApi;
        this.pollOptionsGO.api.setRowData(this.pollOptions);
        if (window.innerWidth < 480) {
          this.pollOptionsGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.pollOptionsGO.api.sizeColumnsToFit();
        }
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
        this.votersGO.api.setRowData(this.votersOptionsGO);
        if (window.innerWidth < 480) {
          this.votersGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.votersGO.api.sizeColumnsToFit();
        }
      },
      rowHeight: 40,
      columnDefs: [
        {headerName: "Voter's Name", field: "firstname", width: 75, lockPosition: true},
        {
          headerName: "Status",
          field: "voterStatus",
          cellRendererFramework: GridVoterStatusComponent,
          suppressFilter: true, suppressResize: true, width: 50,
          sort: "desc", suppressMovable: true
        },
        {headerName: "Chosen Retauarants", field: "latestVotes", sort: "desc"}
      ],
      suppressDragLeaveHidesColumns: true,
      animateRows: true,
      sortingOrder: ["asc", "desc"],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      rowClassRules: {
        "lightred-background": (params) => params.data.menuUrl == "http://www.google.com" || params.data.iconUrl == environment.defaultIconUrl
      }
    }

    this.suggestionsGO = {
      onGridReady: (params) => {
        this.suggestionsGO.api = params.api;
        this.suggestionsGO.columnApi = params.columnApi;
        this.suggestionsGO.api.setRowData(this.suggestionsOptionsGO);
        if (window.innerWidth < 480) {
          this.suggestionsGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.suggestionsGO.api.sizeColumnsToFit();
        }
      },
      rowHeight: 40,
      columnDefs: [
        {headerName: "Type of Suggestion", field: "Type", sort: "asc"},
        {headerName: "Restaurant 1", field: "Restaurant 1", sort: "asc"},
        {headerName: "Restaurant 2", field: "Restaurant 2", sort: "asc"},
        {headerName: "Restaurant 3", field: "Restaurant 3", sort: "asc"},
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc"],
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
      // User clicks on a poll option
      this.currentVoters = []
      this.currentUidVoters = []
      this.currentVoteRestuarantNames = {}
      this.latestPoll.options.forEach(po => {
        po.votes.forEach(name => {
          if (this.currentVoters.indexOf(name) == -1) this.currentVoters.push(name);
        });
        this.currentVoteRestuarantNames[po.name] = po.votes;
      });
      // Gets all the uids that have voted
      this.latestPoll.options.forEach(po => {
        po.uidVotes.forEach(uid => {
          if (this.currentUidVoters.indexOf(uid) == -1) this.currentUidVoters.push(uid);
        });
      });
      this.currentVoters = this.currentVoters.sort((a, b) => a.toLowerCase() <= b.toLowerCase() ? -1 : 1);
      this.getRestaurantVoteListCount()
      if (this.currentUidVoters.indexOf(this.authService.getUid()) > -1) {
        this.updateLatestVotes(this.likedUid(this.authService.getUid()));
      }
      else {
        this.updateLatestVotes([]);
      }

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
      this.allowOrder = state.allowOrders;
    });

    console.log("PollService accountPoll subscribing");
    this.accountsPollSubscription = this.db.collection<AccountFace>('accounts').valueChanges().subscribe(
      data => {
        this.setVoterOptions(data);
      }
    );
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
    if (this.accountsPollSubscription) {
      console.log("PollService accountPoll unsubscribing");
      this.accountsPollSubscription.unsubscribe();
    }
    if (this.accountsSubscription) {
      this.accountsSubscription.unsubscribe();
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

  likedUid(uid): Array<string> {
    return this.latestPoll.options.filter(po => po.uidVotes.includes(uid)).map(po => po.name);
  }

  getRestaurantVoteListCount(): object {
    var restaurants = []
    const restaurantCount = {}
    var restaurantVoters = {}
    for (var i = 0; i < this.currentVoters.length; i++) {
      restaurants = restaurants.concat(this.liked(this.currentVoters[i]));
    }
    for (var k = 0; k < restaurants.length; k++) {
      if (restaurants[k] in restaurantCount) {
        restaurantCount[restaurants[k]] += 1;
      }
      else {
        restaurantCount[restaurants[k]] = 1;
      }
    }
    this.restaurantCountVotes = restaurantCount;
    this.db.collection<PollOption>('poll-options').valueChanges().subscribe(data => {
        this.restaurantDistanceVotes = JSON.parse(JSON.stringify(this.restaurantCountVotes))
        this.restaurantCountDistance = {}
        for (var i = 0; i < data.length; i++) {
          if (data[i].name in this.restaurantCountVotes) {
            const distance = this.getDistance(this.scotiaLat, this.scotiaLong, data[i].latitude, data[i].longitude);
            this.restaurantCountDistance[data[i].name] = distance;
            this.restaurantDistanceVotes[data[i].name] -= distance;
          }
        }
        this.getSuggestions();
        if (this.suggestionsGO.api) this.suggestionsGO.api.setRowData(this.suggestionsOptionsGO);
      }
    )
    return restaurantCount;
  }

  getRadians(x): number {
    return x * Math.PI / 180;
  }

  getDistance(lat1, lon1, lat2, lon2): number {
    var R = 6371; // km
    var dLat = this.getRadians(lat2 - lat1);
    var dLon = this.getRadians(lon2 - lon1);
    var newLat1 = this.getRadians(lat1);
    var newLat2 = this.getRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(newLat1) * Math.cos(newLat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  getSuggestions() {
    var satisfaction = this.getRestaurantsThatSatisfy()
    var highestSatisfactionKeys = this.getKeysWithHighestValue(satisfaction, 3);
    var highestVoteSuggestionsKeys = this.getKeysWithHighestValue(this.restaurantCountVotes, 3);
    var closestSuggestionsKeys = this.getKeysWithHighestValue(this.restaurantCountDistance, -3);
    var highestVoteClosestKeys = this.getKeysWithHighestValue(this.restaurantDistanceVotes, 3);
    var highestVoteRow = {"Type": "Highest Votes"}
    var closestRow = {"Type": "Closest Votes"}
    var highestVoteClosestRow = {"Type": "Highest Votes and Closest Restaurant"}
    var highestSatisfactionRow = {"Type": "Most Satisfied"}

    for (var i = 0; i < 3; i++) {
      var key = "Restaurant " + (i + 1)
      if (highestVoteSuggestionsKeys[i] == undefined) {
        highestVoteRow[key] = " ";
      }
      else {
        highestVoteRow[key] = highestVoteSuggestionsKeys[i] + ' (' + this.restaurantCountVotes[highestVoteSuggestionsKeys[i]] + ' Votes)';

      }
      if (closestSuggestionsKeys[i] == undefined) {
        closestRow[key] = " ";
      }
      else {
        closestRow[key] = closestSuggestionsKeys[i] + ' (' + this.restaurantCountDistance[closestSuggestionsKeys[i]].toFixed(2) + ' km)';

      }
      if (highestVoteClosestKeys[i] == undefined) {
        highestVoteClosestRow[key] = " ";
      }
      else {
        highestVoteClosestRow[key] = highestVoteClosestKeys[i] + ' (Score: ' + this.restaurantDistanceVotes[highestVoteClosestKeys[i]].toFixed(2) + ')';

      }
      if (highestSatisfactionKeys[i] == undefined) {
        highestSatisfactionRow[key] = " ";
      }
      else {
        highestSatisfactionRow[key] = highestSatisfactionKeys[i] + ' (Score: ' + satisfaction[highestSatisfactionKeys[i]]+ ')';

      }
    }
    this.suggestionsOptionsGO = [highestVoteRow, closestRow, highestVoteClosestRow, highestSatisfactionRow];
  }

  getRestaurantsThatSatisfy() {
    var allRestaurants = Object.keys(this.currentVoteRestuarantNames)
    var satisfaction = {}
    var checked = []
    for (var i = 0; i < allRestaurants.length; i++) {
      for (var k = 0; k < allRestaurants.length; k++) {
        if (i == k || checked.indexOf(allRestaurants[k]) > -1) {
          continue;
        }
        var allVoters = this.currentVoteRestuarantNames[allRestaurants[i]].concat(this.currentVoteRestuarantNames[allRestaurants[k]]);
        var uniqueVoters = new Set(allVoters)
        var restaurants = allRestaurants[i] + ", " + allRestaurants[k]
        satisfaction[restaurants] = uniqueVoters.size
      }
      checked.push(allRestaurants[i])
    }
    console.log(satisfaction)
    return satisfaction;
  }

  getKeysWithHighestValue(o, n) {
    var keys = Object.keys(o);
    if (n < 0) {
      keys.sort(function (a, b) {
        return o[a] - o[b];
      })
      return keys.slice(0, n * (-1));
    }
    else {
      keys.sort(function (a, b) {
        return o[b] - o[a];
      })
      return keys.slice(0, n);
    }
  }

  setVoterOptions(data) {
    this.votersOptionsGO = data.map(user => ({
      firstname: user.firstname,
      latestVotes: user.latestVotes,
      voterStatus: user.voteStatus
    })).filter(user => user.voterStatus != "Not Voted");
    if (this.votersGO.api != null) {
      this.votersGO.api.setRowData(this.votersOptionsGO);
    }
  }

  updateVoteStatus(ID, status) {
    if (this.authService.getVoteStatus() != 'Have Ordered') {
      this.db.collection<AccountFace>('accounts').doc(ID).update({"voteStatus": status});
    }
  }

  changeStatusToOrdered(ID) {
    this.db.collection<AccountFace>('accounts').doc(ID).update({"voteStatus": "Not Ordered"});
  }

  updateLatestVotes(latestVotes) {
    let data = {
      "latestVotes": latestVotes
    }
    if (latestVotes.length == 0 && (this.authService.getVoteStatus() != 'Not Ordering' && this.authService.getVoteStatus() != "Have Ordered")) {
      data["voteStatus"] = "Not Voted"
    }
    this.db.collection<AccountFace>('accounts').doc(this.authService.getID()).update(data);
  }
}
