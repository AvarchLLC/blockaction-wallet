import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateBitcoinComponent } from './donate-bitcoin.component';
import { DonateEthereumComponent } from './donate-ethereum.component';

const routes: Routes = [
    { path:'bitcoin', component: DonateBitcoinComponent },
    { path:'ethereum', component: DonateEthereumComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DonationRoutingModule {}
