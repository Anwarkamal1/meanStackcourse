import { Component, OnInit } from '@angular/core';
import { RentalService } from './../../rental/shared/rental.service';
import { Rental } from './../../rental/shared/rental.model';
import { NotificationService } from './../../common/service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.scss']
})
export class ManageRentalComponent implements OnInit {
  rentals: Rental[];
  errors: any[] = [];
  rentalDeleteIndex: number;
  constructor(
    private rentalService: RentalService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.rentalService.getUserRentals().subscribe(
      rentals => {
        this.rentals = rentals.rentals;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.rentals = [];
        }
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }

  deleteRental(rentalId: string) {
    this.rentalService.deleteRental(rentalId).subscribe(
      () => {
        this.rentals.splice(this.rentalDeleteIndex, 1);
        this.rentalDeleteIndex = undefined;
        this.notify.onSuccess('Rental Deleted Successfully!', 'Success');
      },
      (err: HttpErrorResponse) => {
        this.notify.getErrors(err);
        // this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      }
    );
  }
}
