import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { FormsModule } from '@angular/forms';

import { Daterangepicker } from 'ng2-daterangepicker';

import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalComponent } from './rental.component';
import { RentalService } from './shared/rental.service';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';

import { UpperCasePipe } from '../common/pipes/uppercase.pipe';
import { MapModule } from './../common/map/map.module';

import { AuthGuard } from './../auth/shared/auth.guard';

import { BookingService } from './../booking/shared/booking.service';
import { HelperService } from './../common/service/helper.service';
import { NgModule } from '@angular/core';
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
const routes: Routes = [
  {
    path: 'rentals',
    component: RentalComponent,
    children: [
      { path: '', component: RentalListComponent },
      {
        path: ':rentalId',
        component: RentalDetailComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent,
    RentalDetailComponent,
    UpperCasePipe,
    RentalDetailBookingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    NgPipesModule,
    FormsModule,
    MapModule,
    Daterangepicker
  ],
  providers: [RentalService, HelperService, BookingService]
})
export class RentalModule {}
