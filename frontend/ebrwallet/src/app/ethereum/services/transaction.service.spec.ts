import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [TransactionService]
    });
  });

  it('should ...', inject([TransactionService], (service: TransactionService) => {
    expect(service).toBeTruthy();
  }));
});
