import { Component, OnInit } from '@angular/core';
import { RentalService } from './../shared/rental.service';
import { Rental } from './../shared/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../common/service/notification.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
  rentals: Rental[] = [];
  errors: any[] = [];

  constructor(
    private rentalService: RentalService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.rentalService.getRentals().subscribe(
      (data: { rentals: Rental[]; isTrue: boolean }) => {
        this.rentals = data.rentals;
      },
      (err: HttpErrorResponse) => {
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
      // () => {
      //   console.log('completed');
      // }
    );
  }
}
