import { Component, Input, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBack, ellipsisHorizontal,search,settings } from 'ionicons/icons';
import { IonImg,IonTitle,IonToolbar,IonButtons,IonButton,IonIcon,IonBackButton} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';


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
  @Input() endLink: string|null = "";
  @Input() title: string|null = "";
  @Input() initial: string|null = "";
  @Input() backbutton: string|null = "";
  @Input() searchType: string|null = "";
  @Input() searchId: string|null = "";

  constructor(private navCtrl: NavController) { 
    
  }

  ngOnInit() {
    addIcons({ search,ellipsisHorizontal,settings,arrowBack });
  }

  onSearchClick() {
    this.navCtrl.navigateForward(['/search', {
      type: this.searchType,
      id: this.searchId
    }]);
  }

}
