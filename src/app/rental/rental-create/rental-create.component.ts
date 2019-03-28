import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../common/service/notification.service';
@Component({
  selector: 'app-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {
  newRental: Rental;
  rentalCategories = Rental.CATEGORIES;
  // rentalCategories = ['Condo', 'apartment'];
  errors: any[] = [];

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private notify: NotificationService
  ) {}

  handleImageChange() {
    this.newRental.image =
      'https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/13/image.jpeg';
  }

  ngOnInit() {
    this.newRental = new Rental();
    this.newRental.shared = false;
  }

  handleImageUpload(imageUrl: string) {
    this.newRental.image = imageUrl;
  }

  handleImageError() {
    this.newRental.image = '';
  }

  createRental() {
    this.errors = [];
    this.rentalService.create(this.newRental).subscribe(
      (rental: { rental: Rental }) => {
        this.notify.onSuccess('Rental Created Successfully!', 'Success');
        this.router.navigate([`/rentals/${rental.rental._id}`]);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.errors.push(...err.error);
        // this.notify.getErrors(err);
      }
    );
  }
}
