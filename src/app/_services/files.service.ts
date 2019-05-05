import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { FileModel } from '../_models';

@Injectable({ providedIn: 'root' })
export class FilesService {
    constructor(private http: HttpClient, private config: AppConfig) { }

    getAll() {
        return this.http.get<FileModel[]>(`${this.config.apiUrl}files`);
    }
}
