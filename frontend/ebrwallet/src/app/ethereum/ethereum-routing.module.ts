import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EthereumComponent} from './ethereum.component';

const routes: Routes = [
  { path: 'ethereum', component: EthereumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class EthereumRoutingModule {}
