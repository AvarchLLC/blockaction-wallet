import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletComponent } from './wallet.component';

import { WalletService } from '../services/wallet.service';
import { AuthService } from '../services/auth.service';
import { TransactionService } from '../services/transaction.service'; 
import { GoogleAnalyticsService } from '../services/google-analytics.service';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, RouterTestingModule, ReactiveFormsModule, FormsModule,  ],
      declarations: [ WalletComponent ],
      providers: [ AuthService, WalletService, TransactionService, GoogleAnalyticsService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
