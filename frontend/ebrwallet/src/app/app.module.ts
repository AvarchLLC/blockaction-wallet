import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Imports for loading & configuring the in-memory api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

// Project Modules
import { AppRoutingModule} from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { EthereumModule} from './ethereum/ethereum.module';

// Project Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


// Project Services
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    AppRoutingModule,
    AuthModule,
    EthereumModule
  ],
  providers: [  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
