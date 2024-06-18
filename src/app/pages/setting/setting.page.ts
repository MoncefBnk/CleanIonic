import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonItemDivider,IonItemGroup,IonLabel,IonIcon,IonList,IonModal,IonButton,IonButtons,IonText,IonToggle, IonTextarea,IonAvatar } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { addIcons } from 'ionicons';
import { personOutline,keyOutline,languageOutline,logOutOutline,trashBinOutline,closeOutline, mailOutline,cloudDownloadOutline} from 'ionicons/icons';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { RequestResponse } from 'src/app/core/interfaces/response';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonItemDivider,IonItemGroup,IonLabel,IonIcon,IonList,IonModal,IonButton,IonButtons,IonText,IonToggle,IonTextarea,IonAvatar,CommonModule, FormsModule,GeneralHeaderComponent,ReactiveFormsModule,TranslateModule]
})
export class SettingPage implements OnInit {

  private localStore = inject(LocalStorageService);
  private authService = inject(AuthentificationService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private firestore = inject(FirestoreService);

  isEnglishSelected: boolean = false;
  isFrenchSelected: boolean = false;
  error: string = '';
  submitForm: boolean = false;
  user = {} as IUser;

  form: FormGroup = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
    ]),
    label: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(''),
  });

  constructor() {
    addIcons({ personOutline,keyOutline,languageOutline,logOutOutline,trashBinOutline,closeOutline,mailOutline,cloudDownloadOutline });
    this.getUser();

    if (this.translate.currentLang == 'en_US') {
      this.isEnglishSelected = true;
    } else {
      this.isFrenchSelected = true;
    }
   }

  ngOnInit() {
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }

  async onSubmitArtist() {
    this.error = '';
    if (this.form.valid) {
      this.submitForm = true;
      try {
        const data = await this.firestore.createArtist(
          this.user.id, 
          this.form.value.fullname, 
          this.form.value.label, 
          this.form.value.description, 
          this.form.value.avatar
        )
        if (data.error) {
          const error = data as RequestResponse;
          this.error = error?.message ?? '';
        } else {
          const success = data as RequestResponse;
          console.log(success.message);
        }
      } catch(err) {
        console.log(err);
        this.error = 'An error occurred. Please try again.';
      }
    }
  }

  logout(modal: any) {
    modal.dismiss();
    this.authService.logOut();
    this.localStore.removeItem('user');
    this.localStore.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  deleteAccount(modal: any) {
    modal.dismiss();
    this.authService.deleteAccount();
    this.router.navigateByUrl('/auth/login');
  }

  changeLanguage(modal:any) {
    if (this.isEnglishSelected) {
      this.translate.use('en_US');
      this.translate.setDefaultLang('en_US');
    } else if (this.isFrenchSelected) {
      this.translate.use('fr_FR');
    }
   modal.dismiss();
  }

  selectImage() {
   /* const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        this.uploadImage();
      },
      (err) => {
        console.log('Camera issue: ' + err);
      }
    );*/
  }


}
