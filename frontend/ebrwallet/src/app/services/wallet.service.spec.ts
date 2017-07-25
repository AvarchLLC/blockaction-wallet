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

  it('should complete wallet creation', inject([WalletService], (service: WalletService) => {

    const password = 'test';
    let wallet;
    it('should create a new wallet', async () => {

      wallet = await service.createWallet(password);

      expect(wallet).toBeTruthy();
   });

    it('should decrypt private key', async () => {

      const privkey = service.getPrivateKeyString(wallet, password);

      expect(privkey).toBeTruthy();
    });

  }));


});
