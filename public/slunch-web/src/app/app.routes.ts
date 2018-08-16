import { Routes, RouterModule } from '@angular/router';

import { VotePageComponent } from './vote-page/vote-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuardService } from './providers/auth-guard.service';
import { AccountComponent } from './account/account.component';
import { PollCreateComponent } from './poll-create/poll-create.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'vote',
    canActivate: [AuthGuardService],
    component: VotePageComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'new-poll',
    component: PollCreateComponent
  },
  {
    path: 'account',
    component: AccountComponent
  }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
