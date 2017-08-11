import { by, By } from 'protractor/built';
import { SpinnerService } from '../../services/spinner.service';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletComponent } from './wallet.component';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { DataService } from '../../services/data.service';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, ReactiveFormsModule, FormsModule,],
      declarations: [WalletComponent],
      providers: [AuthService, WalletService, TransactionService, GoogleAnalyticsService, SpinnerService, DataService],
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

  it('should change password visibility', () => {
    const passwordElement = fixture.nativeElement.querySelector('#password');
    expect(passwordElement.attributes.type.value).toBe('password');
    component.passphraseType = 'text';
    fixture.detectChanges();
    expect(passwordElement.attributes.type.value).toBe('text');
    component.passphraseType = 'password';
    fixture.detectChanges();
    expect(passwordElement.attributes.type.value).toBe('password');
  });

  it('should check password validity', async(() => {
    const form = component.walletForm;
    const password = form.controls['password'];

    password.setValue('badpassword123');
    expect(component.passwordCheck(password.value)['all']).toBeFalsy();

    password.setValue('wallet');
    expect(component.passwordCheck(password.value).passwordLowercase).toBeTruthy();

    password.setValue('12345678');
    expect(component.passwordCheck(password.value).passwordLength).toBeTruthy();

    password.setValue('123456789123456789122124');
    expect(component.passwordCheck(password.value).passwordLength).toBeFalsy();

    password.setValue('WALLET');
    expect(component.passwordCheck(password.value).passwordUppercase).toBeTruthy();

    password.setValue('@');
    expect(component.passwordCheck(password.value).passwordSpecialchar).toBeTruthy();


    password.setValue('1');
    expect(component.passwordCheck(password.value).passwordNumber).toBeTruthy();

    password.setValue('(');
    expect(component.passwordCheck(password.value).invalidChar).toBeTruthy();

    password.setValue('Wallet@2017')
    expect(component.passwordCheck(password.value)['all']).toBeTruthy();
  }));

  it('should create wallet', () => {
    const password = component.walletForm.controls['password'];
    password.setValue('Wallet@2017')
    expect(component.passwordCheck(password.value)['all']).toBeTruthy();

    // fixture.nativeElement.querySelector('#createButton').click();
    component.create();

    console.log(component.wallet);
    fixture.whenStable().then(() => {
      console.log('After stabble ', component.wallet);
    });
  });
});
