import { alertOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon, IonRow, IonCol } from '@ionic/angular/standalone';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { LoginRequestError, LoginRequestSuccess } from 'src/app/core/interfaces/login';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow,
    IonIcon,
    IonItem,
    IonList,
    IonTitle,
    IonInput,
    IonHeader,
    IonButton,
    IonToolbar,
    IonContent,
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class RegisterPage implements OnInit {

  error: string = '';
  submitForm: boolean = false;
  showPassword: boolean = false;
  private serviceAuth = inject(AuthentificationService);
  private localStore = inject(LocalStorageService);
  private router = inject(Router);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9-]+$'),
    ]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
  });

  constructor() {
    addIcons({
      'alert-circle-outline': alertOutline,
      'eye-off-outline': eyeOffOutline,
      'eye-outline': eyeOutline,
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
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
}
