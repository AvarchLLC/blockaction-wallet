import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { WalletInfoComponent } from './wallet-info.component';
import { PaginatePipe, PaginationControlsDirective } from 'ngx-pagination';

import { SharedModule } from '../../shared/shared.module';
import { TransactionService } from '../services/transaction.service';
import { WalletService } from '../services/wallet.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';



describe('WalletInfoComponent', () => {
  let component: WalletInfoComponent;
  let fixture: ComponentFixture<WalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ SharedModule, RouterModule, RouterTestingModule, HttpModule ],
      declarations: [ WalletInfoComponent, PaginatePipe, PaginationControlsDirective ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ TransactionService, WalletService, GoogleAnalyticsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
