import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Imports for loading & configuring the in-memory api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

// Project Modules
import { AppRoutingModule} from './app-routing.module';
import { AuthModule } from './auth/auth.module';

// Project Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { TransactionComponent } from './ethereum/components/transaction/transaction.component';
import { WalletComponent } from './ethereum/components/wallet/wallet.component';

// Project Services
import { WalletService } from './services/wallet.service';
import { AuthService } from './services/auth.service';
import { TransactionService } from './services/transaction.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { WalletInfoComponent } from './ethereum/components/wallet-info/wallet-info.component';

@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    WalletComponent,
    HomeComponent,
    TransactionComponent,
    WalletInfoComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    AppRoutingModule,
    AuthModule
  ],
  providers: [ WalletService, AuthService, TransactionService, GoogleAnalyticsService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
