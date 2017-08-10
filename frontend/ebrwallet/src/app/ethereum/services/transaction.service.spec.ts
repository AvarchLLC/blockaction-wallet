import { MockBackend } from '@angular/http/testing';
import { TestBed, inject, async } from '@angular/core/testing';

import { HttpModule, ResponseOptions, XHRBackend } from '@angular/http';
import { TransactionService } from './transaction.service';

const API_URL = `https://mainnet.infura.io`;

declare var web3: any;

describe('TransactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        { provide: API_URL, useValue: 'https://kovan.infura.io' },
        TransactionService
      ]
    });
  });

  beforeEach(() => {
    (<any>window).ga = jasmine.createSpy('ga');
  });

  afterEach(() => {
    (<any>window).ga = undefined;
  });

  // let service;
  it('should create', inject([TransactionService], (transactionService: TransactionService) => {
    // service = transactionService;
    expect(transactionService).toBeTruthy();
  }));

  it('should create transaction', async(inject([TransactionService], (service) => {

    // const mockResponse = {
    //   id : 1,
    //   jsonrpc : '2.0',
    //   result: '0x0'
    // };

    // mockBackend.connections.subscribe((connection) => {
    //   connection.mockRespond(new Response(new ResponseOptions({
    //     body: JSON.stringify(mockResponse)
    //   })));
    // });
    const hexValue = 0x2100;

    service
      .createTransaction('0x4D281C3536ce503505aa1893c6303fB5B9fe584b','0xCd2a3d9f938e13Cd947eC05ABC7fe734df8DD826',{value : hexValue})
      .then( txn => {
        console.log('txn', txn)
        expect(txn).toBeTruthy();
      })
      .catch(err => {
        console.log('err', err)
      });
  })));

        // it('should sign and serialize transaction', async(() => {
        //   console.log('raw', txn);
        //   service
        //     .signAndSerializeTransaction(txn, '0x8ee876cae9ea3896144b41cfbb69fc56e2c2299c29a4fe7f272c859e3062cef7')
        //     .then(serialTx => {
        //       expect(serialTx).toBeTruthy();
        //     })
        //     .catch(err => console.log('error ', err));
        // }));

  // it('should estimate the gas cost of transaction', async(inject([XHRBackend], (mockBackend) => {

  //   const mockResponse = {
  //     id : 1,
  //     jsonrpc : '2.0',
  //     result: '0x1'
  //   };

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(new ResponseOptions({
  //       body: JSON.stringify(mockResponse)
  //     })));
  //   });

  //   const wei_value = service.etherToWei('2');
  //   const hexValue = service.intToHex(wei_value);

  //   service
  //     .getTransactionCost({
  //       to : '0x4D281C3536ce503505aa1893c6303fB5B9fe584b',
  //       value : hexValue
  //     })
  //     .then(price => {
  //       expect(price).toBeTruthy();
  //     });
  // })));

  // it('should get transaction details', async(() => {
  //   service
  //     .getTransactionDetails('0xc91a76c2143610e098a709ecf9458de5d21aaed1e14b270bf3d490ac225a74ac')
  //     .then(txDetails => {
  //       expect(txDetails).toBeTruthy();
  //     });
  // }));

  // it('should get all transactions of an address', async(() => {
  //   service
  //     .getAllTransactions('0x4D281C3536ce503505aa1893c6303fB5B9fe584b')
  //     .then(txns => {
  //       expect(txns).toBeTruthy();
  //     });
  // }));

  // it('should get the conversion rate', async(() => {
  //   service
  //     .getConversionRate('ethusd')
  //     .then(rate => {
  //       expect(rate).toBeTruthy();
  //     });
  // }));

  // it('should get balance', async(() => {
  //   service
  //     .getBalance('0x4D281C3536ce503505aa1893c6303fB5B9fe584b')
  //     .then(res => {
  //       expect(res).toBeTruthy();
  //     });
  // }));

});
