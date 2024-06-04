import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol, IonButtons, IonButton, IonBackButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { addIcons } from 'ionicons';
import { heart, pause, pauseCircle, play, playCircle, playSkipBack, playSkipBackOutline, playSkipForward, playSkipForwardOutline, repeat, repeatOutline, shuffle } from 'ionicons/icons';


@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [IonImg, IonIcon, IonBackButton, IonButton, IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    GeneralHeaderComponent,
  ],
})
export class PlayerPage implements OnInit {

  playing: boolean = true;
  constructor() {
    addIcons({repeat, playSkipBackOutline, playCircle, pauseCircle, playSkipForwardOutline, shuffle   })
  }
  start_icon : string = "search";
  end_icon : string = "search";
  image : string = "assets/icon/logo_mini.png";

  playMusic(){
    this.playing = !this.playing;
  }

  ngOnInit() {}
}
