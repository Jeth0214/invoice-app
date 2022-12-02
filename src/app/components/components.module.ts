import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressFormComponent } from './forms/address-form/address-form.component';
import { ItemFormComponent } from './forms/item-form/item-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddressFormComponent,
    ItemFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    AddressFormComponent,
    ItemFormComponent
  ]
})
export class ComponentsModule { }
