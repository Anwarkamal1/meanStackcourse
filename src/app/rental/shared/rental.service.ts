import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  constructor(private http: HttpClient) {}
  getRentalById(_id: string): Observable<any> {
    return this.http.get<any>('/api/v1/rentals/' + _id);
  }
  getRentals(): Observable<any> {
    return this.http.get<any>('/api/v1/rentals');
  }
}
