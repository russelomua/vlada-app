import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { FileModel } from '../_models';
import { tap, catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { uploadProgress, uploadResult } from '../_helpers/uploading';

@Injectable({ providedIn: 'root' })
export class FilesService {
    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private toast: ToastService,
    ) {}

    files: FileModel[] = [];
    uploading: FileModel[] = [];

    getAll(id: number) {
        this.files = [];
        return this.http.get<FileModel[]>(`${this.config.apiUrl}orders/${id}/files`);
        /*
        .pipe(
            tap({
              next: files => {
                this.files = files;
              },
              error: () => {
                this.files = [];
              }
            })
        ) */
    }

    removeFromUploading(file: FileModel) {
        const index = this.uploading.indexOf(file);
        if (index >= 0) {
            this.uploading.splice(index);
        }
    }

    deleteFile(file: FileModel) {
        return this.http.delete<FileModel>(`${this.config.apiUrl}files/${file.id}`).pipe(
            tap(files => {
                const index = this.files.indexOf(file);
                if (index >= 0) {
                    this.files.splice(index, 1);
                }
            })
        );
    }

    uploadFile(orderId: number, file: any) {
        const uploadingFile: FileModel = {
            filename: file.name,
            status: 'uploading'
        };

        this.uploading.push(uploadingFile);

        const form = new FormData();
        form.append('upload', file);

        return this.http.post(`${this.config.apiUrl}orders/${orderId}/files`, form, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            catchError(err => {
                this.toast.show(err);
                this.removeFromUploading(uploadingFile);
                return err;
            }),
            uploadProgress(progress => {
                uploadingFile.progress = progress;
            }),
            uploadResult<FileModel>( uploadedFile => {
                this.removeFromUploading(uploadingFile);
                this.files.push(uploadedFile);
            })
        );
    }
}
