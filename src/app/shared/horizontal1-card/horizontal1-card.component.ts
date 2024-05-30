import { Component, Input, OnInit } from '@angular/core';
import { ISong } from 'src/app/core/interfaces/song';
import { IonButton,IonButtons,IonIcon,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
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
    CommonModule
  ]
})
export class Horizontal1CardComponent  implements OnInit {

  @Input() lastPlayeds: ISong[] = [];
  constructor() {
    addIcons({ ellipsisHorizontal });
   }

  ngOnInit() {}

}
