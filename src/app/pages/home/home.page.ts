import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { Component } from '@angular/core';
import { IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, musicalNotesOutline, person, home, search } from 'ionicons/icons';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonContent,IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,IonIcon,IonButtons,IonButton],
})
export class HomePage {
  constructor() {
    addIcons({ search });
  }
}
