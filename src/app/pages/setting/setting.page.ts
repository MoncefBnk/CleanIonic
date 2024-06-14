import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonItemDivider,IonItemGroup,IonLabel,IonIcon,IonList,IonModal,IonButton,IonButtons,IonText,IonToggle, IonTextarea,IonAvatar } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { addIcons } from 'ionicons';
import { personOutline,keyOutline,languageOutline,logOutOutline,trashBinOutline,closeOutline, mailOutline} from 'ionicons/icons';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


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

  isEnglishSelected: boolean = false;
  isFrenchSelected: boolean = false;

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
    addIcons({ personOutline,keyOutline,languageOutline,logOutOutline,trashBinOutline,closeOutline,mailOutline });
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

  /**
   * async onSubmit() {
    this.error = '';
    if (this.form.valid) {
      this.submitForm = true;
      try {
        const data = await this.serviceAuth.register(
          this.form.value.email, 
          this.form.value.password, 
          this.form.value.phoneNumber, 
          this.form.value.firstName, 
          this.form.value.lastName,
          this.form.value.dateBirth
        )

        if (data.error) {
          const error = data as LoginRequestError;
          this.error = error?.message ?? '';
        } else {
          const success = data as LoginRequestSuccess;
          this.localStore.setItem('user', success.user);
          this.localStore.setItem('token', success.token);
          this.router.navigateByUrl('/home');
        }
      } catch(err) {
        console.log(err);
        this.error = 'An error occurred. Please try again.';
      }
    }
  }
   */

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



}
