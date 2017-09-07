import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { DonateBitcoinComponent } from './donation/donate-bitcoin.component';
import { DonateEthereumComponent } from './donation/donate-ethereum.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'help', component: HelpComponent },
  {
    path: 'bitcoin',
    loadChildren: 'app/bitcoin/bitcoin.module#BitcoinModule'
  },
  {
    path: 'ethereum',
    loadChildren: 'app/ethereum/ethereum.module#EthereumModule'
  },
  { path: 'donation' ,
    loadChildren: 'app/donation/donation.module#DonationModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
