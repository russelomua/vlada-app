import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageSelectorComponent, CreateOrderComponent, FileItemComponent } from './index';
import { StatusPipe } from '../_pipes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    LanguageSelectorComponent,
    CreateOrderComponent,
    FileItemComponent,
    StatusPipe,
  ],
  exports: [
    TranslateModule,
    LanguageSelectorComponent,
    CreateOrderComponent,
    FileItemComponent,
    StatusPipe,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ComponentsModule { }
