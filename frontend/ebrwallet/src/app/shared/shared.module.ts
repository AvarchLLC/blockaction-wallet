import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConverterBoxComponent } from './converter-box/converter-box.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConverterBoxComponent
  ],
  declarations: [ ConverterBoxComponent ]
})
export class SharedModule { }
