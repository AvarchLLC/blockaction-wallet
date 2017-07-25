import { by } from 'protractor/built';
import { SpinnerService } from '../../services/spinner.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletComponent } from './wallet.component';

import { WalletService } from '../../services/wallet.service';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, RouterTestingModule, ReactiveFormsModule, FormsModule,  ],
      declarations: [ WalletComponent ],
      providers: [ AuthService, WalletService, TransactionService, GoogleAnalyticsService, SpinnerService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    (<any>window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
     (<any>window).ga = undefined;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change password visibility', async () => {
    component.passphraseType = 'text'
    const app = fixture.debugElement.componentInstance;
    
    console.log(fixture.nativeElement.querySelector('#passphraseToggle').event)
    console.log("Password Input Type: , ", fixture.nativeElement.querySelector('#password').attributes.type.value)
    expect(fixture.nativeElement.querySelector('#password').attributes.type.value).toEqual('text')
    // menuDropDownButtonEl = menuDropDownButtonDe.nativeElement;
    // expect(passwordInput.attributes.type).toBe('text')
    // expect(app.nativeElement.getElementById('password')).toEqual('text');
    // component.passphraseType = 'password';
    // expect(app.nativeElement.getElementById('password').type).toEqual('password');

  });
});
