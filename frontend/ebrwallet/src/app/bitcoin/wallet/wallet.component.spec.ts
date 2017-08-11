import { by, By } from 'protractor/built';
import { SpinnerService } from '../../services/spinner.service';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletComponent } from './wallet.component';

import { WalletService } from '../services/wallet.service';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../services/transaction.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ReactiveFormsModule, FormsModule,],
      declarations: [WalletComponent],
      providers: [AuthService, WalletService, TransactionService, GoogleAnalyticsService, SpinnerService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    (<any>window).ga = jasmine.createSpy('ga');

    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    component.ready = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    (<any>window).ga = undefined;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });


 

  it('should create wallet', () => {
    // fixture.nativeElement.querySelector('#createButton').click();
    component.create();

    console.log(component.wallet);
    fixture.whenStable().then(() => {
      console.log('After stabble ', component.wallet);
    });
  });
});
