import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceHandlerService {

  authService: AuthService;
  stateService: StateService;

  constructor(authService: AuthService, stateService: StateService) {
    this.authService = authService;
    this.stateService = stateService;
  }

  subscribe(){
    this.authService.subscribe();
    this.stateService.subscribe();
  }

  unsubscribe(){
    this.authService.unsubscribe();
    this.stateService.unsubscribe();
  }

}
