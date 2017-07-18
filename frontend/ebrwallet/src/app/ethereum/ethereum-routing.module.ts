import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './components/wallet/wallet.component';
// import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'wallet', component: WalletComponent },
  // { path: 'register', component: RegisterComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AuthRoutingModule {}
