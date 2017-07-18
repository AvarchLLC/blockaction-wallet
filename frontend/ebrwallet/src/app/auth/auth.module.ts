import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';


import { AuthRoutingModule } from './auth-routing.module'

import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'

import { AuthService } from '../services/auth.service';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AuthRoutingModule
  ],
  providers: [ AuthService ],
  bootstrap: [ LoginComponent ]
})

export class AuthModule { }
