import { HttpResponse, HttpEventType, HttpEvent } from '@angular/common/http';
import { tap, filter, map } from 'rxjs/operators';
import { pipe } from 'rxjs';

export function uploadProgress<T>( cb: ( progress: number ) => void ) {
    return tap(( event: HttpEvent<T> ) => {
        if ( event.type === HttpEventType.UploadProgress ) {
            cb((event.loaded / event.total));
        }
    });
}


export function uploadResult<T>( cb: ( result: T ) => void ) {
    return pipe(
        filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
        map(( res: HttpResponse<T> ) => {
            cb(res.body);
            return res.body;
        })
    );
}
