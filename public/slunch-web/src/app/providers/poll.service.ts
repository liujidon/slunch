import {Injectable} from '@angular/core';
import {PollOption} from '../poll-option';
import {Poll} from '../poll';
import {AngularFirestore, docChanges} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
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

  suggestionsGO: GridOptions;

  votersOptions: Array<any> = [];
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

  accountsPollSubscription: Subscription;
  accountsSubscription: Subscription;

  voteGOApi: any;
  voteGOColumnApi: any;

  newOptions: number = 0;


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
        console.log(params.api)
        console.log(params.columnApi)
        this.voteGOColumnApi = params.columnApi;
        this.voteGOApi = params.api;
        this.votersGO.api = params.api;
        this.votersGO.columnApi = params.columnApi;
        // this.votersGO.api.setRowData(this.voterListOptions());
        if (window.innerWidth < 480) {
          this.votersGO.columnApi.autoSizeAllColumns();
        }
        else {
          this.votersGO.api.sizeColumnsToFit();
        }
      },
      rowHeight: 40,
      columnDefs: [
        {headerName: "Voter's Name", field: "name", sort: "asc"},
        {headerName: "Chosen Retauarants", field: "restaurants", sort: "asc"},
        {
          headerName: "Ordered?",
          field: "voterStatus",
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

    this.suggestionsGO = {
      onGridReady: (params) => {
        this.suggestionsGO.api = params.api;
        this.suggestionsGO.columnApi = params.columnApi;
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
      console.log(this.latestPoll);
      // User clicks on a poll option
      this.currentVoters = []
      this.currentUidVoters = []
      this.latestPoll.options.forEach(po => {
        po.votes.forEach(name => {
          if (this.currentVoters.indexOf(name) == -1) this.currentVoters.push(name);
        });
      });
      // Gets all the uids that have voted
      this.latestPoll.options.forEach(po => {
        po.uidVotes.forEach(uid => {
          if (this.currentUidVoters.indexOf(uid) == -1) this.currentUidVoters.push(uid);
        });
      });
      this.currentVoters = this.currentVoters.sort((a, b) => a.toLowerCase() <= b.toLowerCase() ? -1 : 1);
      this.getRestaurantVoteListCount()
      console.log(this.allowPoll)
      if (this.allowPoll && !this.allowOrder) {
        if (this.currentUidVoters.indexOf(this.authService.getUid()) > -1) {
          this.updateLatestVotes(this.likedUid(this.authService.getUid()));
        }
        else {
          this.updateLatestVotes([]);
        }
      }
      this.db.collection<AccountFace>('accounts').valueChanges().subscribe(
        data => {
          this.setVoterOptions(data);
        }
      );
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

  //Make a function where for each uid, you call likedUid for each uid and get a list of restaurants
  // Take that list of restaurants in the loop, and make a function in auth service to update that specific
  // Account with the list, and the vote status. In the auth service subscribe to the change, and make a method
  // that creates an object of voter options, and then set that object to the voteGO api

  getVoterList(): Array<any> {
    return this.votersOptions;
  }

  getRestaurantVoteListCount(): object {
    var restaurants = []
    const restaurantCount = {}
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
            const distance = this.getDistance(43.649479, -79.379566, data[i].latitude, data[i].longitude);
            this.restaurantCountDistance[data[i].name] = distance;
            this.restaurantDistanceVotes[data[i].name] -= distance;
          }
        }
        if (this.suggestionsGO.api) this.suggestionsGO.api.setRowData(this.getSuggestions());
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
    var highestVoteSuggestionsKeys = this.getKeysWithHighestValue(this.restaurantCountVotes, 3);
    var closestSuggestionsKeys = this.getKeysWithHighestValue(this.restaurantCountDistance, -3);
    var highestVoteClosestKeys = this.getKeysWithHighestValue(this.restaurantDistanceVotes, 3);
    var highestVoteRow = {"Type": "Highest Votes"}
    var closestRow = {"Type": "Closest Votes"}
    var highestVoteClosestRow = {"Type": "Highest Votes and Closest Restaurant"}

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
    }
    return [highestVoteRow, closestRow, highestVoteClosestRow];
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
    var options = [];
    for (var i = 0; i < data.length; i++) {
      var user = data[i];
      if (user.voteStatus != "Not Voted") {
        var voteData = {};
        var restaurants = this.convertListToString(user.latestVotes);
        voteData["name"] = user.firstname;
        voteData["restaurants"] = restaurants;
        voteData["voterStatus"] = user.voteStatus;
        options.push(voteData);
      }
    }
    console.log(options)
    console.log(this.votersGO.api)
    console.log(this.votersGO)
    this.votersGO.api = this.voteGOApi;
    this.votersGO.columnApi = this.voteGOColumnApi;
    this.votersGO.api.setRowData(options);
  }

  convertListToString(voteList) {
    var str = "";
    for (var i = 0; i < voteList.length; i++) {
      if (i == voteList.length - 1) {
        str += voteList[i];

      }
      else {
        str += voteList[i] + ", ";
      }
    }
    return str;
  }


  updateVoteStatus() {
    let data = {
      "voteStatus": "Not Ordered"
    }
    this.db.collection<AccountFace>('accounts').doc(this.authService.getID()).update(data);
  }

  updateVoteStatusForSpecificID(ID) {
    let data = {
      "voteStatus": "Not Ordered"
    }
    this.db.collection<AccountFace>('accounts').doc(ID).update(data);
  }

  updateVoteStatusToOrdered() {
    let data = {
      "voteStatus": "Ordered"
    }
    this.db.collection<AccountFace>('accounts').doc(this.authService.getID()).update(data);
  }

  updateLatestVotes(latestVotes) {
    let data = {
      "latestVotes": latestVotes,
      "voteStatus": "Not Ordered"
    }
    if (latestVotes.length == 0) {
      data = {
        "voteStatus": "Not Voted",
        "latestVotes": latestVotes
      }
    }
    this.db.collection<AccountFace>('accounts').doc(this.authService.getID()).update(data);
  }

  toggleOrderStatus(account, data) {
    this.db.collection<AccountFace>('accounts').doc(account.id).update(data);
  }

  resetVoteStatus() {
    let data = {
      "voteStatus": "Not Voted",
      "latestVotes": []
    }
    this.accountsSubscription = this.db.collection<AccountFace>("accounts").snapshotChanges().subscribe(
      docChangeActions => {
        let temp = docChangeActions.filter(docChangeAction => docChangeAction.payload.doc);
        for (var i = 0; i < temp.length; i++) {
          this.db.collection<AccountFace>('accounts').doc(temp[i].payload.doc.id).update(data);
        }
      });
  }

}
