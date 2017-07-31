import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavComponent,
    RouterModule
  ],
  declarations: [NavComponent],
  providers: [AuthService, GoogleAnalyticsService, SpinnerService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}



