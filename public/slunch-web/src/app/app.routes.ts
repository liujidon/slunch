import { Routes, RouterModule } from '@angular/router';

import { VotePageComponent } from './vote-page/vote-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuardService } from './providers/auth-guard.service';
import { UnprocessedComponent } from './unprocessed/unprocessed.component';
import { AccountComponent } from './account/account.component';

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
    path: 'unprocessed',
    component: UnprocessedComponent
  },
  {
    path: 'account',
    component: AccountComponent
  }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
