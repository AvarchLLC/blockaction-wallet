import { TestBed, inject, async } from '@angular/core/testing';

import { WalletService } from './wallet.service';
import { HttpModule } from '@angular/http';

describe('WalletService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [WalletService]
    });
  }));

  it('should work', inject([WalletService], (service: WalletService) => {
    expect(service).toBeTruthy();
  }));
});
