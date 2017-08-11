import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';

import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HttpModule } from '@angular/http';
import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';

import { SharedModule } from '../../shared/shared.module';
import { SpinnerService } from '../../services/spinner.service';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpModule, SharedModule ],
      declarations: [ TransactionComponent ],
      providers: [ WalletService, TransactionService, SpinnerService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
