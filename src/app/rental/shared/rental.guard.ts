import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { RentalService } from './rental.service';
import { Observable, EmptyError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RentalGuard implements CanActivate {
  constructor(private rentalService: RentalService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const rentalId = route.params.rentalId;
    return this.rentalService.verifyUser(rentalId).pipe(
      map(status => {
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/rentals']);
        return of(false);
      })
    );
  }
}
