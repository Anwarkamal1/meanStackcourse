import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { ManageRentalComponent } from './manage-rental/manage-rental.component';
import { NgPipesModule } from 'ngx-pipes';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { AuthGuard } from './../auth/shared/auth.guard';
import { RentalService } from './../rental/shared/rental.service';
import { BookingService } from './../booking/shared/booking.service';
import { FormatDatePipe } from './../common/pipes/format-date.pipe';
import { ManageRentalBookingComponent } from './manage-rental/manage-rental-booking/manage-rental-booking.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'rentals',
        component: ManageRentalComponent
      },
      {
        path: 'bookings',
        component: ManageBookingComponent
      }
    ]
  }
];
@NgModule({
  declarations: [
    ManageComponent,
    ManageRentalComponent,
    ManageBookingComponent,
    FormatDatePipe,
    ManageRentalBookingComponent
  ],
  imports: [RouterModule.forChild(routes), CommonModule, NgPipesModule],
  providers: [RentalService, BookingService]
})
export class ManageModule {}
