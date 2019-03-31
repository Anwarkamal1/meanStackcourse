import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Rental } from '../../shared/rental.model';
import { Booking } from './../../../booking/shared/booking.model';

import { AuthService } from './../../../auth/shared/auth.service';
import { HelperService } from './../../../common/service/helper.service';
import { NotificationService } from './../../../common/service/notification.service';

import * as moment from 'moment';
import { BookingService } from './../../../booking/shared/booking.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
  @Input('rental') rental: Rental;
  @ViewChild(DaterangePickerComponent) private picker: DaterangePickerComponent;
  newBooking: Booking;
  errors: any[] = [];
  modelREf: any;

  public daterange: any = {};
  bookedOutDates: any[] = [];
  public options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    autoUpdateInput: false,
    opens: 'left',
    isInvalidDate: this.checkForInvalidDate.bind(this)
  };

  constructor(
    public auth: AuthService,
    private helperService: HelperService,
    private modelService: NgbModal,
    private bookingService: BookingService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.getBookedOutDates();
    this.newBooking = new Booking();
  }
  private checkForInvalidDate(date) {
    // console.log(date);
    return (
      this.bookedOutDates.includes(
        this.helperService.formatDateForComparision(date)
      ) || date.diff(moment(), 'days') < 0
    );

    // return (
    //   this.bookedOutDates.includes(moment(date)) ||
    //   date.diff(moment(), 'days') < 0
    // );
  }
  private getBookedOutDates() {
    const bookings: Booking[] = this.rental.bookings;
    if (bookings.length > 0) {
      bookings.forEach((booking: Booking) => {
        const dateRange = this.helperService.getBookingRangeOfDates(
          booking.startAt,
          booking.endAt
        );
        this.bookedOutDates.push(...dateRange);
        // console.log(this.bookedOutDates);
      });
    }
  }
  private addNewBookedOutDates(bookingData: any) {
    const dateRange = this.helperService.getBookingRangeOfDates(
      bookingData.startAt,
      bookingData.endAt
    );
    this.bookedOutDates.push(...dateRange);
  }
  private resetDatePicker() {
    this.picker.datePicker.setStartDate(new Date());
    this.picker.datePicker.setEndDate(new Date());
    this.picker.datePicker.element.val('');
    // console.log(this.picker.datePicker);
  }
  openConfirmModal(content) {
    this.errors = [];

    this.modelREf = this.modelService.open(content);
    // console.log(this.newBooking);
  }
  createBooking() {
    this.errors = [];
    this.newBooking.rental = this.rental;
    this.bookingService.create(this.newBooking).subscribe(
      (bookingData: any) => {
        this.addNewBookedOutDates(bookingData);
        this.newBooking = new Booking();
        this.modelREf.close();
        this.resetDatePicker();
        this.notify.onSuccess(
          'Booking created Successfully, Check your "Manage" section!',
          'Success'
        );
      },
      (err: HttpErrorResponse) => {
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }
  public selectedDate(value: any, datepicker?: any) {
    // any object can be passed to the selected event and it will be passed back here
    this.options.autoUpdateInput = true;
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.newBooking.startAt = this.helperService.formatforSaving(value.start);
    this.newBooking.endAt = this.helperService.formatforSaving(value.end);
    this.newBooking.days = this.helperService.daysDifference(
      value.start,
      value.end
    );
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
    // console.log(-value.start.diff(value.end, 'days'));
    // console.log(this.helperService.daysDifference(value.start, value.end));
  }
}
