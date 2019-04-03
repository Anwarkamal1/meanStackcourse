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
    const startdatesplits = startAt.split('-');
    const enddatesplit = endAt.split('-');
    let customdates = startdatesplits[2];
    let custommonths = startdatesplits[1];
    let arraysm = Array.from(custommonths);
    let arraysd = Array.from(customdates);
    if (arraysd[0] === '0') {
      customdates = startdatesplits[2][1];
    }
    if (arraysm[0] === '0') {
      custommonths = startdatesplits[1][1];
    }
    let customdateed = enddatesplit[2];
    let customdateem = enddatesplit[1];
    let arrayem = Array.from(customdateem);
    let arrayed = Array.from(customdateed);
    if (arrayem[0] === '0') {
      customdateem = enddatesplit[1][1];
    }
    if (arrayed[0] === '0') {
      customdateed = enddatesplit[2][1];
    }
    tempDates.push(
      startdatesplits[0] +
        `${dateFormat}` +
        (custommonths - 1) +
        `${dateFormat}` +
        customdates
    );
    while (mStartAt < mEndat) {
      tempDates.push(
        mStartAt.getFullYear() +
          dateFormat +
          mStartAt.getMonth() +
          dateFormat +
          mStartAt.getDate()
      );

      mStartAt.setDate(mStartAt.getDate() + 1);
    }
    tempDates.push(
      enddatesplit[0] +
        `${dateFormat}` +
        (customdateem - 1) +
        `${dateFormat}` +
        customdateed
    );
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
    if (formatDate.getMonth() === 11) {
      return formatDate.getFullYear() + '-' + 12 + '-' + formatDate.getDate();
    }
    return (
      formatDate.getFullYear() +
      Booking.DATE_FORMATMID +
      (formatDate.getMonth() + 1) +
      Booking.DATE_FORMATMID +
      formatDate.getDate()
    );
  }
  formatDateForComparision(datee) {
    let date = new Date(datee);
    return (
      date.getFullYear() +
      Booking.DATE_FORMATMID +
      date.getMonth() +
      Booking.DATE_FORMATMID +
      date.getDate()
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
