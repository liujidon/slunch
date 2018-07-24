import { Routes, RouterModule } from '@angular/router';

import { VotePageComponent } from './vote-page/vote-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from './providers/auth.service';
import { AuthGuardService } from './providers/auth-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'vote',
    canActivate: [AuthGuardService],
    component: VotePageComponent
  }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
