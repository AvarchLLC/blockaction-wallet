import { TestBed, inject } from '@angular/core/testing';

import { WalletService } from './wallet.service';

describe('WalletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WalletService]
    });
  });

  it('should ...', inject([WalletService], (service: WalletService) => {
    expect(service).toBeTruthy();
  }));

  describe('wallet creation',inject([WalletService], (service: WalletService) => {

    var password = 'test'
    var wallet;
    it('should create a new wallet', () => {

      service
        .createWallet(password)
        .then(data => {
          wallet = data;
          expect(data).toBeTruthy();
        })
        .catch(err => console.error("errors", err))
    })

    it('should decrypt private key', () => {

      service
        .getPrivateKeyString(wallet,password)
        .then(key => {
          expect(key).toBeTruthy();
        })
    })

  }));


});