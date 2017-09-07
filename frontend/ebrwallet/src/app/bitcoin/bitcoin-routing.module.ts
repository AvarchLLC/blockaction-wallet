import { RequestBitcoinComponent } from './request/request-bitcoin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './wallet/wallet.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  { path: 'wallet', component: WalletComponent },
  { path: 'send', component: TransactionComponent },
  { path: 'info', component: WalletInfoComponent },
  { path: 'request', component: RequestBitcoinComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BitcoinRoutingModule {}
