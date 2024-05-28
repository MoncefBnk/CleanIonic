import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent, IonInput, IonItem } from '@ionic/angular/standalone';
import { AuthentificationService } from 'src/app/core/services/authentification.service';

@Component({
  standalone: true,
  selector: 'app-password-lost',
  templateUrl: './password-lost.component.html',
  styleUrls: ['./password-lost.component.scss'],
  imports: [IonItem, IonInput, IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader],
})
export class PasswordLostComponent {

  private router = inject(Router);
  private serviceAuth = inject(AuthentificationService);
  private modalCtl = inject(ModalController);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
  });
  constructor() {}
  // onSubmit() {
  //   this.error = '';
  //   if (this.form.valid) {
  //     this.submitForm = true;
  //     this.serviceAuth
  //       .login(this.form.value.email, this.form.value.password)
  //       .subscribe((data: any | LoginRequestError) => {
  //         if (data.error) {
  //           this.error = data.message;
  //         } else {
  //           // Add LocalStorage User
  //           this.router.navigateByUrl('/home');
  //         }
  //         console.log(data);
  //       });
  //   }
  // }
  async cancel(){
    await this.modalCtl.dismiss();
  }
}

