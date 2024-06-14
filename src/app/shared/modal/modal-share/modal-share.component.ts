import { Component, Input, OnInit } from '@angular/core';
import { closeCircle,logoFacebook,logoWhatsapp,logoInstagram, logoTwitter } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonModal,IonText, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-modal-share',
  templateUrl: './modal-share.component.html',
  styleUrls: ['./modal-share.component.scss'],
  imports : [IonText,IonIcon,IonButtons,IonButton,IonToolbar,IonModal,IonTitle,IonContent,CommonModule]
})
export class ModalShareComponent  implements OnInit {

  @Input() modal!: IonModal;
  @Input() item: any;

  constructor() { 
    addIcons({ closeCircle,logoFacebook,logoWhatsapp,logoInstagram, logoTwitter});
  }

  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }

}
