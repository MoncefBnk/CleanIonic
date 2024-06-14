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

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonItemDivider,IonItemGroup,IonLabel,IonIcon,IonList,IonModal,IonButton,IonButtons,IonText,IonToggle,IonTextarea,IonAvatar,CommonModule, FormsModule,GeneralHeaderComponent,ReactiveFormsModule]
})
export class SettingPage implements OnInit {

  private localStore = inject(LocalStorageService);
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

}
