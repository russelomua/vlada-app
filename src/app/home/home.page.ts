import { Component, OnInit } from '@angular/core';
import { FileModel } from '../_models/file';
import { File } from '@ionic-native/file/ngx';

import { ToastService, FilesService, AuthenticationService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  files: FileModel[] = [];

  constructor(
    private toastService: ToastService,
    private filesService: FilesService,
    public auth: AuthenticationService
  ) {}

  remove(file: FileModel) {
    const index = this.files.indexOf(file);
    if (index >= 0) {
      this.files.splice(index, 1);
    }
  }
  openFile() {
    document.getElementById('file').click();
  }

  loadFiles(event?) {
    const Files = this.filesService.getAll();
    Files.subscribe(files => {
      this.files = files;

      if (typeof event !== 'undefined') {
        event.target.complete();
      }
    }, error => {
      console.log(error);
      if (typeof event !== 'undefined') {
        event.target.error();
      }
    });
  }

  async uploadFile(event) {
    const files = event.target.files;

    this.toastService.show('Загружаю ' + files.length + ' файл(ов)');

    for (const file of files) {
      // let path = await this.file.resolveLocalFilesystemUrl(file);
      const fileModel: FileModel = {
        filename: file.name,
        status: 'uploading',
      };

      this.files.push(fileModel);
    }
  }

  ngOnInit() {
    this.loadFiles();
  }

}
