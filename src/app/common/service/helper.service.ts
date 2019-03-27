import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Booking } from './../../booking/shared/booking.model';
@Injectable()
export class HelperService {
  constructor() {}
  private getRangeOfDates(startAt, endAt, dateFormat) {
    const tempDates = [];
    const mEndat = new Date(endAt);
    let mStartAt = new Date(startAt);
    const startdatesplit = startAt.split('/');
    let customd = startdatesplit[2];
    if (Array.from(startdatesplit[2])[0] + '' === '0') {
      customd = startdatesplit[2].slice(1);
    }
    let startMonth = +startdatesplit[1] - 1;
    tempDates.push(
      +customd -
        1 +
        `${dateFormat}` +
        startMonth +
        `${dateFormat}` +
        startdatesplit[2]
    );
    while (mStartAt < mEndat) {
      if (tempDates.indexOf(this.formatBookingDate(mStartAt)) === -1) {
        tempDates.push(this.formatBookingDate(mStartAt));
      }
      mStartAt.setDate(mStartAt.getDate() + 1);
    }
    tempDates.push(this.formatBookingDate(mEndat));
    return tempDates;
  }
  public getBookingRangeOfDates(startAt, endAt) {
    return this.getRangeOfDates(startAt, endAt, Booking.DATE_FORMATMID);
  }
  /**
   * formatBookingDate
date   */
  public formatBookingDate(date) {
    return this.formatDate(date, Booking.DATE_FORMATMID);
  }
  private formatDate(date, format) {
    const formatDate = new Date(date);
    return (
      formatDate.getFullYear() +
      format +
      formatDate.getMonth() +
      format +
      (formatDate.getDate() - 1)
    );
  }
  formatforSaving(date) {
    const formatDate = new Date(date);
    return (
      formatDate.getFullYear() +
      Booking.DATE_FORMATMID +
      (formatDate.getMonth() + 1) +
      Booking.DATE_FORMATMID +
      formatDate.getDate()
    );
  }

  daysDifference(startAt, endAt) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(startAt);
    // var firstDate = new Date('2019, 03, 17');
    var secondDate = new Date(endAt);
    // var secondDate = new Date();

    var diffDays = Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );
    return diffDays;
  }
}
