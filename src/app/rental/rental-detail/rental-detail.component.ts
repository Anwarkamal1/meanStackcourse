import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RentalService } from './../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {
  rental: Rental;
  constructor(
    private activatedRoute: ActivatedRoute,
    private rentalService: RentalService
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
    this.rentalService.getRentalById(rentalId).subscribe((rental: any) => {
      this.rental = rental.rental;
    });
  }
}
