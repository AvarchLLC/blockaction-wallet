import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { EthereumRoutingModule } from './ethereum-routing.module';
import {SharedModule} from '../shared/shared.module';

import {WalletComponent} from './wallet/wallet.component';
import {TransactionComponent} from './transaction/transaction.component';
import {WalletInfoComponent} from './wallet-info/wallet-info.component';

import {WalletService} from './services/wallet.service';
import {TransactionService} from './services/transaction.service';

@NgModule({
  imports: [
    EthereumRoutingModule,
    SharedModule
  ],
  declarations: [
    WalletComponent,
    TransactionComponent,
    WalletInfoComponent
  ],
  providers: [WalletService, TransactionService],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EthereumModule { }
