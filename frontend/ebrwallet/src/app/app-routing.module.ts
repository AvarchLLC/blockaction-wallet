import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './ethereum/components/wallet/wallet.component';
import { HomeComponent } from './home/home.component';
import { TransactionComponent } from './ethereum/components/transaction/transaction.component';
import { WalletInfoComponent } from './ethereum/components/wallet-info/wallet-info.component';

const routes: Routes = [
  // { path: '*', redirectTo: '', pathMatch: 'full'},
  { path: '', component: HomeComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'send-ether', component: TransactionComponent },
  { path: 'wallet-info', component: WalletInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
