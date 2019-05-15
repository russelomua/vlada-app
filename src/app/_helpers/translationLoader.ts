import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import * as contentEn from '../_i18n/en.json';
import * as contentUk from '../_i18n/uk.json';

const TRANSLATIONS = {
  en: contentEn,
  uk: contentUk
};

export class TranslateUniversalLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(TRANSLATIONS[lang].default);
  }
}