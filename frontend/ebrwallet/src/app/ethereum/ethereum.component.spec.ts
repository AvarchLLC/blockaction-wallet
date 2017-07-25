import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { SharedModule } from '../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthereumComponent } from './ethereum.component';

describe('EthereumComponent', () => {
  let component: EthereumComponent;
  let fixture: ComponentFixture<EthereumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      declarations: [ EthereumComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ GoogleAnalyticsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthereumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
