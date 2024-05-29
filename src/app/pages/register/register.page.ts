import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { alertOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, inject } from '@angular/core';
import { LoginRequestError } from 'src/app/core/interfaces/login';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonButton } from '@ionic/angular/standalone';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { PasswordLostComponent } from 'src/app/shared/modal/password-lost/password-lost.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButton, IonList, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  error = '';
  submitForm = false;

  private modalCtl = inject(ModalController);
  private router = inject(Router);
  private serviceAuth = inject(AuthentificationService);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor() {
    addIcons({
    'alert-circle-outline': alertOutline,
  });
}

  ngOnInit() {}

  onSubmit() {
    this.error = '';
    if (this.form.valid) {
      this.submitForm = true;
      this.serviceAuth
        .login(this.form.value.email, this.form.value.password)
        .subscribe((data: any | LoginRequestError) => {
          if (data.error) {
            this.error = data.message;
          } else {
            // Add LocalStorage User
            this.router.navigateByUrl('/home');
          }
          console.log(data);
        });
    }
  }
  async onPasswordLostModal() {
    const modal = await this.modalCtl.create({
      component: PasswordLostComponent,
    });
    modal.present();
  }
}

