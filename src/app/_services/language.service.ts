import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    constructor(private translate: TranslateService) {}

    use(language: string) {
        this.translate.use(language);
    }

    init() {
        const browserLang = this.translate.getBrowserLang();

        this.translate.addLangs(['en', 'uk']);
        this.translate.setDefaultLang('uk');
        this.translate.use(browserLang.match(/en|uk/) ? browserLang : 'uk');
    }
}
