import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageSelectorComponent, CreateOrderComponent, FileItemComponent } from './index';
import { StatusPipe } from '../_pipes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppHeaderComponent } from './app-header/app-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    LeafletModule,
    RouterModule,
  ],
  declarations: [
    AppHeaderComponent,
    LanguageSelectorComponent,
    CreateOrderComponent,
    FileItemComponent,
    StatusPipe,
  ],
  exports: [
    TranslateModule,
    LeafletModule,
    AppHeaderComponent,
    LanguageSelectorComponent,
    CreateOrderComponent,
    FileItemComponent,
    StatusPipe,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ComponentsModule { }
