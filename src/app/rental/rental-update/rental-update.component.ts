import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RentalService } from './../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../common/service/notification.service';

@Component({
  selector: 'app-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {
  rental: Rental;
  errors: any[] = [];
  rentalCategories: string[] = Rental.CATEGORIES;
  constructor(
    private activatedRoute: ActivatedRoute,
    private rentalService: RentalService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    // const id = this.activatedRoute.snapshot.paramMap.get('rentalId');
    // console.log(id);
    this.activatedRoute.params.subscribe(params => {
      // console.log(params.rentalId);
      this.getRental(params['rentalId']);
    });
    // this.activatedRoute.paramMap.subscribe((params: Params) => {
    //   console.log(params.params[params.keys[0]]);
    // });
  }
  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe(
      (rental: any) => {
        this.rental = rental.rental;
      },
      (err: HttpErrorResponse) => {
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }
  updateRental(_id, rental) {
    // this.rental[Object.keys(rental)[0]] = rental[Object.keys(rental)[0]];
    this.rentalService.updateRental(_id, rental).subscribe(
      (rental: any) => {
        this.rental = rental.rental;
      },
      (err: HttpErrorResponse) => {
        this.getRental(_id);
        this.errors.push(...err.error);
        this.notify.getErrors(err);
      }
    );
  }
  countBedroomAssets(assetsNum: number) {
    return parseInt(<any>this.rental.bedrooms, 10) + assetsNum || 0;
  }
}
