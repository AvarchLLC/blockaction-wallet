import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';

import { HttpModule } from '@angular/http';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ], 
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
