import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ImageUploadService {
  constructor(private http: HttpClient) {}
  public uploadImage(image: File): Observable<string> | any {
    const formDate = new FormData();
    formDate.append('json', JSON.stringify({ anwar: 'kamal' }));
    console.log(image);
    formDate.append('image', image);
    return this.http.post<Observable<any>>(
      '/api/v1/rentals/img-upload',
      formDate
    );
  }
}
