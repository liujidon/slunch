import { Injectable } from '@angular/core';
import { PollOption } from '../poll-option';
import { Poll } from '../poll';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs'
import { environment } from '../../environments/environment';
import { StateFace } from '../interfaces';
import { GridOptions } from 'ag-grid';
import { GridImageComponent } from '../gridElements/grid-image/grid-image.component';
import { GridPollOptionControlComponent } from '../gridElements/grid-poll-option-control/grid-poll-option-control.component';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  pollOptions: Array<PollOption> = [];
  pollOptionsSubscription: Subscription;

  pollOptionsGO: GridOptions;

  latestPollSubscription: Subscription;
  latestPoll: Poll;

  stateSubscription: Subscription;
  allowPoll: Boolean;

  constructor(public db: AngularFirestore, public authService: AuthService) {

    this.pollOptionsGO = {
      onGridReady: (params) => {
        this.pollOptionsGO.api = params.api;
        this.pollOptionsGO.columnApi = params.columnApi;
        this.pollOptionsGO.api.setRowData(this.pollOptions);
        this.pollOptionsGO.columnApi.autoSizeAllColumns();
      },
      rowHeight: 120,
      columnDefs: [
        { headerName: "Name", field: "name", sort: "asc"},
        { headerName: "Icon", cellRendererFramework: GridImageComponent, width:110 },
        { headerName: "Icon URL", field: "iconUrl", editable: true },
        { headerName: "Menu URL", field: "menuUrl", editable: true },
        {
          headerName: "Control",
          cellRendererFramework: GridPollOptionControlComponent,
          cellRendererParams: { pollService: this }
        }
      ],
      animateRows: true,
      sortingOrder: ["asc", "desc", null],
      enableSorting: true,
      enableColResize: true,
      enableFilter: true
    }

  }

  subscribe() {
    console.log("PollService latestPollSubscription subscribing");
    this.latestPollSubscription = this.db.collection<Poll>('poll', ref => ref.orderBy('createtime', 'desc').limit(1)).valueChanges().subscribe(pollArray => {
      this.latestPoll = pollArray[0];
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

}
