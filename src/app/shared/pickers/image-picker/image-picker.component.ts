import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>(); // base 64 image or file
  @Input() showPreview: boolean = false;
  selectedImage: string;
  usePicker: boolean = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  onPickImage(): void {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    Camera.getPhoto({
      quality: 75,
      source: CameraSource.Prompt, // chose between library and camera
      correctOrientation: true,
      width: 600,
      height: 337,
      resultType: CameraResultType.DataUrl,
    })
      .then((image) => {
        this.selectedImage = image?.dataUrl;
        this.imagePick.emit(image?.dataUrl);
      })
      .catch((error) => {
        console.log(error);
        if (this.filePickerRef) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  // fallback for file picker on device without camera
  onFileChosen(event: Event) {
    const pickedFile = (event?.target as HTMLInputElement)?.files?.[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      this.selectedImage = fr.result.toString();
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
