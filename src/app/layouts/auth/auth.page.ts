import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { EAuthPage } from 'src/app/core/models/refData';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AuthPage implements OnInit {
  private router = inject(ActivatedRoute);
  constructor() { }

  ngOnInit() {
    this.router.data.subscribe((component)=> {
      console.log(component);
    })
  }

}
