import { Component, OnInit } from '@angular/core';
import { BookingService } from './../../booking/shared/booking.service';
import { Booking } from './../../booking/shared/booking.model';
import { NotificationService } from './../../common/service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {
  bookings: Booking[];
  isTrue = false;
  errors: any[] = [];
  constructor(
    private bookingService: BookingService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe(
      bookings => {
        this.bookings = bookings.bookings;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.bookings = [];
        }
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }
}
