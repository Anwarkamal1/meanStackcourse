import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { NotificationService } from '../../service/notification.service';
class FileSnippet {
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  constructor(
    private imgUploadService: ImageUploadService,
    private notify: NotificationService
  ) {}
  selectedFile: FileSnippet;
  responseImg = '';
  @Output() imageUploaded = new EventEmitter();
  @Output() imageError = new EventEmitter();
  ngOnInit() {}
  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.responseImg = imageUrl;
    // this.responseImg = 'http://localhost:3000/' + imageUrl;
    this.imageUploaded.emit(imageUrl);
  }
  private onFailure() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'FAIL';
    this.imageError.emit('');
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      this.imgUploadService.uploadImage(this.selectedFile.file).subscribe(
        response => {
          this.onSuccess(response.imagePath);
        },
        err => {
          this.onFailure();

          this.notify.getErrors(err);
        }
      );
    });
    reader.readAsDataURL(file);
  }
}
