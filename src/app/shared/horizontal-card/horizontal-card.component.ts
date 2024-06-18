import { Component, Input, OnInit } from '@angular/core';
import { ModalShareComponent } from '../modal/modal-share/modal-share.component';
import { ModalController } from '@ionic/angular';
import { IElement } from 'src/app/core/interfaces/element';
import { addIcons } from 'ionicons';
import { shareSocialOutline,heart,heartOutline,ellipsisVertical } from 'ionicons/icons';
import { IonItem,IonText,IonImg,IonButton,IonIcon } from '@ionic/angular/standalone';


@Component({
  selector: 'app-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss'],
  standalone:true,
  imports: [IonItem,IonText,IonButton,IonIcon,IonImg]

})
export class HorizontalCardComponent  implements OnInit {
  @Input() element = {} as IElement;
  isIconDark: boolean = false;
  selectedItem: any;
  isFavorite: boolean = false;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    addIcons({ shareSocialOutline,heart,heartOutline,ellipsisVertical });
  }

  async openModal(item: any) {
    const modal = await this.modalController.create({
      component: ModalShareComponent,
    });
    return await modal.present();
  }

  makeFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
