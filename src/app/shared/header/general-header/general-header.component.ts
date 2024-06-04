import { Component, Input, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBack, ellipsisHorizontal,search,settings } from 'ionicons/icons';
import { IonImg,IonTitle,IonToolbar,IonButtons,IonButton,IonIcon,IonBackButton} from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-general-header',
  templateUrl: './general-header.component.html',
  styleUrls: ['./general-header.component.scss'],
  imports: [IonTitle,IonToolbar,IonButtons,IonButton,IonIcon,IonBackButton,IonImg]
})
export class GeneralHeaderComponent  implements OnInit {

  @Input() startIcon: string|null = "";
  @Input() endIcon: string|null = "";
  @Input() title: string|null = "";
  @Input() image: string|null = "";

  constructor() { 
    addIcons({ search,ellipsisHorizontal,settings,arrowBack });
  }

  ngOnInit() {}

}
