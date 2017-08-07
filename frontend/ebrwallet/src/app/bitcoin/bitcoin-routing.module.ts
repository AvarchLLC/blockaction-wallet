import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './wallet/wallet.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';

const routes: Routes = [
  { path: 'bitcoin/wallet', component: WalletComponent },
  { path: 'bitcoin/info', component: WalletInfoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class BitcoinRoutingModule {}
