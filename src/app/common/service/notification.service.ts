import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  onSuccess(message, title) {
    this.toastr.success(message, title, {
      closeButton: true
    });
  }
  onWarning(message, title) {
    this.toastr.warning(message, title, {
      closeButton: true
    });
  }
  onError(message, title) {
    this.toastr.error(message, title, {
      closeButton: true
    });
  }
}
