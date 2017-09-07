import {NgModule} from '@angular/core';

import { EthereumRoutingModule } from './ethereum-routing.module';
import {SharedModule} from '../shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import { QrScannerModule } from 'angular2-qrscanner';

import {WalletComponent} from './wallet/wallet.component';
import {TransactionComponent} from './transaction/transaction.component';
import {WalletInfoComponent} from './wallet-info/wallet-info.component';
import { RequestEtherComponent } from './request/request-ether.component';

import {EthereumWalletService} from './services/ethereum-wallet.service';
import {EthereumTransactionService} from './services/ethereum-transaction.service';

@NgModule({
  imports: [
    EthereumRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QrScannerModule
  ],
  declarations: [
    WalletComponent,
    TransactionComponent,
    WalletInfoComponent,
    RequestEtherComponent
  ],
  providers: [EthereumWalletService, EthereumTransactionService]
})
export class EthereumModule { }
