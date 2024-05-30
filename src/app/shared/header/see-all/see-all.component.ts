import { Component, Input, OnInit } from '@angular/core';
import { IonText,IonItem,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  selector: 'app-see-all',
  templateUrl: './see-all.component.html',
  styleUrls: ['./see-all.component.scss'],
  imports: [IonText,IonItem, IonContent,IonHeader, IonToolbar, IonTitle, IonContent,IonIcon,IonButtons,IonButton,],
})
export class SeeAllComponent  implements OnInit {

  @Input() elementTitle: string = "";

  constructor() { }

  ngOnInit() {}

}
