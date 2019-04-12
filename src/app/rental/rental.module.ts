import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { Daterangepicker } from 'ng2-daterangepicker';
import { UpperCasePipe } from '../common/pipes/uppercase.pipe';

import { MapModule } from './../common/map/map.module';
import { EditableModule } from './../common/components/editable/editable.module';

import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalComponent } from './rental.component';
import { RentalService } from './shared/rental.service';
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';
import { RentalSearchComponent } from './rental-search/rental-search.component';

import { AuthGuard } from './../auth/shared/auth.guard';

import { BookingService } from './../booking/shared/booking.service';
import { HelperService } from './../common/service/helper.service';
import { RentalCreateComponent } from './rental-create/rental-create.component';
import { RentalUpdateComponent } from './rental-update/rental-update.component';
import { RentalGuard } from './shared/rental.guard';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';

const routes: Routes = [
  {
    path: 'rentals',
    component: RentalComponent,

    children: [
      { path: '', component: RentalListComponent },
      {
        path: 'new',
        component: RentalCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':rentalId/edit',
        component: RentalUpdateComponent,
        canActivate: [AuthGuard, RentalGuard]
      },
      {
        path: ':rentalId',
        component: RentalDetailComponent
      },
      {
        path: ':city/homes',
        component: RentalSearchComponent
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
    RentalDetailBookingComponent,
    RentalSearchComponent,
    RentalCreateComponent,
    RentalUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    NgPipesModule,
    FormsModule,
    MapModule,
    EditableModule,
    Daterangepicker,
    ImageUploadModule
  ],
  providers: [RentalService, RentalGuard, HelperService, BookingService]
})
export class RentalModule {}
