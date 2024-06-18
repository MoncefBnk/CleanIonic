import { Component, Input, OnInit } from '@angular/core';
import { ModalShareComponent } from '../modal/modal-share/modal-share.component';
import { ModalController } from '@ionic/angular';
import { IElement } from 'src/app/core/interfaces/element';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { IonItem,IonText,IonImg,IonButton,IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  standalone:true,
  imports: [IonItem,IonText,IonButton,IonIcon,IonImg]
})
export class SearchResultComponent  implements OnInit {
  @Input() element = {} as IElement;
  constructor() { }

  ngOnInit() {
    addIcons({ close });
  }

  removeElement(id:string) {
    
  }

}
