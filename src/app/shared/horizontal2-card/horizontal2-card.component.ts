import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong } from 'src/app/core/interfaces/song';
import { ellipsisVertical,heartCircleOutline,shareSocialOutline,heart } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonModal,IonLabel,IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { ModalShareComponent } from '../modal-share/modal-share.component';
import { ModalController } from '@ionic/angular';


@Component({
  standalone: true,
  selector: 'app-horizontal2-card',
  templateUrl: './horizontal2-card.component.html',
  styleUrls: ['./horizontal2-card.component.scss'],
  imports: [IonTitle,IonModal,IonLabel,IonText,IonList,IonItem,IonGrid,IonRow,IonCol,IonButton,IonButtons,IonImg,IonIcon,CommonModule,ModalShareComponent]
})
export class Horizontal2CardComponent  implements OnInit {

  constructor(private modalController: ModalController) { 
    addIcons({ ellipsisVertical,heartCircleOutline,shareSocialOutline,heart});
  }

  @Input() albums: IAlbum[] = [];
  @Input() songs: ISong[] = [];
  @Input() playlists: IPlaylist[] = [];
  isIconDark: boolean = false;
  selectedItem: any;

  ngOnInit() {}

  async openModal(item: any) {
    const modal = await this.modalController.create({
      component: ModalShareComponent,
    });
    return await modal.present();
  }

  
  toggleIconColor() {
    this.isIconDark = !this.isIconDark;
  }
}
