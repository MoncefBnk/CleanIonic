import { Component, Input, OnInit } from '@angular/core';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong } from 'src/app/core/interfaces/song';
import { ellipsisVertical,heartCircleOutline,shareSocialOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonLabel,IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IPlaylist } from 'src/app/core/interfaces/user';

@Component({
  standalone: true,
  selector: 'app-horizontal2-card',
  templateUrl: './horizontal2-card.component.html',
  styleUrls: ['./horizontal2-card.component.scss'],
  imports: [IonLabel,IonText,IonList,IonItem,IonGrid,IonRow,IonCol,IonButton,IonButtons,IonImg,IonIcon,CommonModule]
})
export class Horizontal2CardComponent  implements OnInit {

  constructor() { 
    addIcons({ ellipsisVertical,heartCircleOutline,shareSocialOutline});
  }

  @Input() albums: IAlbum[] = [];
  @Input() songs: ISong[] = [];
  @Input() playlists: IPlaylist[] = [];

  ngOnInit() {}

}
