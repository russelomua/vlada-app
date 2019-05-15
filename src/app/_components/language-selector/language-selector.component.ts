import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/_services';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  constructor(
    public language: LanguageService,
    private actionSheetController: ActionSheetController,
    private translation: TranslateService,
  ) {}

  ngOnInit() {}

  async openSelector() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translation.instant('Langs'),
      buttons: [{
        text: 'Українська',
        handler: () => {
          this.language.use('uk');
        }
      }, {
        text: 'English',
        handler: () => {
          this.language.use('en');
        }
      }]
    });
    await actionSheet.present();
  }

}
