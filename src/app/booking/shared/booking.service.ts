import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) {}
  public create(booking: Booking): Observable<any> {
    return this.http.post<any>('/api/v1/bookings', booking);
  }
}
