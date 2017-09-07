import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestEtherComponent } from './request/request-ether.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: 'wallet', component: WalletComponent },
  { path: 'send', component: TransactionComponent },
  { path: 'info', component: WalletInfoComponent },
  { path: 'request', component: RequestEtherComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class EthereumRoutingModule {}
