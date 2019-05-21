import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { CreateOrderComponent } from '../_components';
import { ComponentsModule } from '../_components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: HomePage
    }])
  ],
  entryComponents: [CreateOrderComponent],
  declarations: [HomePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class HomePageModule {}
