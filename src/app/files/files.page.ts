import { Component, OnInit } from '@angular/core';
import { FileModel } from '../models/file.model';
import { File } from '@ionic-native/file/ngx';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {
  files: FileModel[] = [];

  constructor(
    public toastController: ToastController,
    private file: File
  ) {
    console.log(this.file);
    this.toastController.create({
      message: 'uploading ',
      duration: 2000
    });
  }

  remove(file: FileModel) {
    let index = this.files.indexOf(file);
    if (index >= 0)
      this.files.splice(index, 1);
  }
  openFile() {
    document.getElementById('file').click();
  }
  async uploadFile(event) {
    let files = event.target.files;

    const toast = await this.toastController.create({
      message: 'Загружаю '+files.length+' файл(ов)',
      duration: 2000
    });

    toast.present();

    for (let file of files) {
      //let path = await this.file.resolveLocalFilesystemUrl(file);
      let fileModel: FileModel = {
        filename: file.name,
        status: 'uploading'
      }
      this.files.push(fileModel);
    }
  }

  ngOnInit() {
    let file = new FileModel();
    file.filename = "File #1";
    file.path = "/path/to/File.txt";
    file.status = 'idle';

    this.files.push(file);
  }

}
