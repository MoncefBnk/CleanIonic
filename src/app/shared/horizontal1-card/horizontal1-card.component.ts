import { Component, Input, OnInit } from '@angular/core';
import { ISong } from 'src/app/core/interfaces/song';
import { IonText,IonButton,IonButtons,IonIcon,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-horizontal1-card',
  templateUrl: './horizontal1-card.component.html',
  styleUrls: ['./horizontal1-card.component.scss'],
  imports : [
    IonItem,
    IonList,
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid,
    IonIcon,
    IonButton,
    IonButtons,
    IonText,
    CommonModule
  ]
})
export class Horizontal1CardComponent  implements OnInit {

  @Input() lastPlayeds: ISong[] = [];
  constructor() {
    addIcons({ ellipsisHorizontal });
   }

  ngOnInit() {}

  formatDuration(seconds: number): string {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const formattedTime = [
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');

    return formattedTime;
  }

}
