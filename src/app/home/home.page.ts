import { Component, OnInit } from '@angular/core';
import { FileModel } from '../_models/file';
import { File } from '@ionic-native/file/ngx';

import { ToastService, FilesService, AuthenticationService } from '../_services';
import { tap, map } from 'rxjs/operators';

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

  ngOnInit() {
    this.loadFiles();
  }

  openFile() {
    document.getElementById('file').click();
  }

  loadFiles() {
    this.filesService.getAll().subscribe();
  }

  getFiles() {
    return this.filesService.files;
  }

  getUploads() {
    return this.filesService.uploading;
  }

  refreshFiles(event) {
    this.filesService.getAll().subscribe(() => {
      event.target.complete();
    }, () => {
      event.target.error();
    });
  }

  uploadFiles(event) {
    const files = event.target.files;

    if (files.length == 0){
      return;
    }

    // this.toastService.show('Загружаю ' + files.length + ' файл(ов)');

    for (const file of files) {
      this.filesService.uploadFile(file).subscribe(
        uploadedFile => {
          this.toastService.show(`Файл ${uploadedFile.filename} загружен`);
        }
      );
    }

    event.target.value = '';
  }

  deleteFile(file: FileModel) {
    this.filesService.deleteFile(file).subscribe(() => {
      this.toastService.show(`Файл ${file.filename} удален`);
    }, (err) => {
      this.toastService.show(err);
    })
  }

}
