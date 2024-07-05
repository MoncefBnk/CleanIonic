import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBack, ellipsisHorizontal,search,settings } from 'ionicons/icons';
import { IonHeader,IonImg,IonTitle,IonToolbar,IonButtons,IonButton,IonIcon,IonBackButton} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-general-header',
  templateUrl: './general-header.component.html',
  styleUrls: ['./general-header.component.scss'],
  imports: [IonTitle,IonToolbar,IonButtons,IonButton,IonIcon,IonBackButton,IonImg,IonHeader]
})
export class GeneralHeaderComponent  implements OnInit,OnDestroy {

  @Input() startIcon: string|null = null;
  @Input() endIcon: string|null = null;
  @Input() endLink: string|null = null;
  @Input() title: string|null = null;
  @Input() initial: string|null = null;
  @Input() backbutton: string|null = null;
  @Input() searchType: string|null = null;
  @Input() searchId: string|null = null;

  constructor(private navCtrl: NavController,private router: Router) { 
    
  }

  ngOnInit() {
    addIcons({ search,ellipsisHorizontal,settings,arrowBack });
  }

  onlinkClick() {
    this.router.navigate([this.endLink]);
  }

  ngOnDestroy() {
    console.log('header ');
  }

}
