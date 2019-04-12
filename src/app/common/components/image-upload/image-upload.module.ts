import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { FormsModule } from '@angular/forms';
import { ImageUploadService } from './image-upload.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../service/notification.service';

@NgModule({
  declarations: [ImageUploadComponent],
  imports: [CommonModule, FormsModule, HttpClientModule],
  exports: [ImageUploadComponent],
  providers: [ImageUploadService, NotificationService]
})
export class ImageUploadModule {}
