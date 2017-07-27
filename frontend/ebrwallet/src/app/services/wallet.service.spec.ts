import { TestBed, inject, async } from '@angular/core/testing';

import { WalletService } from './wallet.service';
import { HttpModule } from '@angular/http';
<<<<<<< HEAD

=======
>>>>>>> master
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

  it('should complete multiple wallet creation', async(inject([WalletService], async (service: WalletService) => {

    const accounts = [];
console.log('here')
      for (let i = 1; i <= 100; i++) {
        const password = 'test' + i.toString();
        const wallet = await service.createWallet(password);
        accounts[i] = wallet;
        console.log(wallet);
      }

        // expect(accounts).toBeTruthy();
        expect(accounts.length).toBe(1000);
    it('should create multiple new wallet', () => {
    });

      it('should decrypt private key',  () => {

        for (let i = 1; i <= 100; i++) {

          const password = 'test' + i.toString();
          const wallet = accounts[i];

          const privkey = service.getPrivateKeyString(wallet, password);

          expect(privkey).toBe(wallet.privkey);
        }

      });


  })));


});
