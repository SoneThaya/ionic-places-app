import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
//import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
  GalleryPhoto,
  ImageOptions,
} from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('hybrid', this.platform.is('hybrid'));
    console.log('iOS', this.platform.is('ios'));
    console.log('android', this.platform.is('android'));
    console.log('desktop', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  async onPickImage() {
    if (this.usePicker) {
      this.filePickerRef.nativeElement.click();
    }
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      quality: 60,
      correctOrientation: true,
      //height: 320,
      width: 300,
    });

    this.selectedImage = capturedPhoto.dataUrl;
    this.imagePick.emit(this.selectedImage);
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
