import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionComponent } from './transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: 'ethereum/wallet', component: WalletComponent },
  { path: 'ethereum/send', component: TransactionComponent },
  { path: 'ethereum/info', component: WalletInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class EthereumRoutingModule {}
