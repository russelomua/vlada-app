import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../_components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild([{
        path: '',
        component: ProfilePage
    }])
  ],
  declarations: [ProfilePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ProfilePageModule {}
