import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import {ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { environment } from '../environments/environment';
import { PollComponent } from './poll/poll.component';
import { PollOptionComponent } from './poll-option/poll-option.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from './providers/auth.service';
import { AuthGuardService } from './providers/auth-guard.service';
import { StateService } from './providers/state.service';
import { PastOrderService } from './providers/past-order.service';
import { TransactionService } from './providers/transaction.service';
import { VotePageComponent } from './vote-page/vote-page.component';
import { OrderComponent } from './order/order.component';
import { PollCreateComponent } from './poll-create/poll-create.component';
import { HeaderComponent } from './header/header.component';
import { AccountComponent } from './account/account.component';
import { HeaderPlainComponent } from './header-plain/header-plain.component';
import { PollService } from './providers/poll.service';
import { ServiceHandlerService } from './providers/service-handler.service';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './providers/admin.service';
import { SortPipe } from './pipes/sort.pipe';
import { FormatterService } from './providers/formatter.service';
import { GridCancelTransactionComponent } from './gridElements/grid-cancel-transaction/grid-cancel-transaction.component';
import { GridCancelTransactionAdminComponent } from './gridElements/grid-cancel-transaction-admin/grid-cancel-transaction-admin.component';
import { GridControlStatusComponent } from './gridElements/grid-control-status/grid-control-status.component';
import { GridStatusComponent } from './gridElements/grid-status/grid-status.component';
import { GridVoterStatusComponent} from './gridElements/grid-voter-status/grid-voter-status.component';
import { GridImageComponent } from './gridElements/grid-image/grid-image.component';
import { GridPollOptionControlComponent } from './gridElements/grid-poll-option-control/grid-poll-option-control.component';
import { GridConfirmTransactionComponent } from './gridElements/grid-confirm-transaction/grid-confirm-transaction.component';
import { CalculatePriceComponent } from './calculate-price/calculate-price.component';
import { EditPollOptionComponent } from './edit-poll-option/edit-poll-option.component';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    VotePageComponent,
    LoginPageComponent,
    PollComponent,
    PollOptionComponent,
    OrderComponent,
    PollCreateComponent,
    HeaderComponent,
    AccountComponent,
    HeaderPlainComponent,
    AdminComponent,
    SortPipe,
    GridCancelTransactionComponent,
    GridCancelTransactionAdminComponent,
    GridControlStatusComponent,
    GridStatusComponent,
    GridVoterStatusComponent,
    GridImageComponent,
    GridPollOptionControlComponent,
    GridConfirmTransactionComponent,
    CalculatePriceComponent,
    EditPollOptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    AngularFireModule.initializeApp(environment.firebase, 'slunch-web'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    AuthService,
    AuthGuardService,
    StateService,
    TransactionService,
    PollService,
    ServiceHandlerService,
    AdminService,
    FormatterService,
    PastOrderService
  ],
  entryComponents: [
    GridCancelTransactionComponent,
    GridCancelTransactionAdminComponent,
    GridControlStatusComponent,
    GridStatusComponent,
    GridVoterStatusComponent,
    GridImageComponent,
    GridPollOptionControlComponent,
    GridConfirmTransactionComponent,
    CalculatePriceComponent,
    ConfirmationDialogComponent,
    EditPollOptionComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
