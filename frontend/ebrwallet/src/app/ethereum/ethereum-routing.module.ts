import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestEtherComponent } from './request/request-ether.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: 'ethereum/wallet', component: WalletComponent },
  { path: 'ethereum/send', component: TransactionComponent },
  { path: 'ethereum/info', component: WalletInfoComponent },
  { path: 'ethereum/request', component: RequestEtherComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class EthereumRoutingModule {}
