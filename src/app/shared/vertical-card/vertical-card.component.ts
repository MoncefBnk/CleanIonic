import { Component, Input, OnInit } from '@angular/core';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong } from 'src/app/core/interfaces/song';
import { IonText,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';



@Component({
  standalone: true,
  selector: 'app-vertical-card',
  templateUrl: './vertical-card.component.html',
  styleUrls: ['./vertical-card.component.scss'],
  imports : [
    IonItem,
    IonList,
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid,
    IonText,
    CommonModule
  ]
})
export class VerticalCardComponent  implements OnInit {

  @Input() albums: IAlbum[] = [];
  @Input() songs: ISong[] = [];

  constructor() { 
      
  }

  ngOnInit() {}

}
