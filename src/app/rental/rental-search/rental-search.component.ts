import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { NotificationService } from './../../common/service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rental-search',
  templateUrl: './rental-search.component.html',
  styleUrls: ['./rental-search.component.scss']
})
export class RentalSearchComponent implements OnInit {
  city: string;
  rentals: Rental[] = [];
  errors: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.city = params['city'];
      this.getRentalByCity();
    });
  }
  private getRentalByCity() {
    this.errors = [];
    this.rentals = [];
    this.rentalService.getRentalsByCity(this.city).subscribe(
      (rentals: { rentals: Rental[]; ok: boolean }) => {
        this.rentals = rentals.rentals;
      },
      (err: HttpErrorResponse) => {
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }
}
