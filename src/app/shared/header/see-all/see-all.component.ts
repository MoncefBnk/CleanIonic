import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonText,IonItem,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone:true,
  selector: 'app-see-all',
  templateUrl: './see-all.component.html',
  styleUrls: ['./see-all.component.scss'],
  imports: [IonText,IonItem, IonContent,IonHeader, IonToolbar, IonTitle, IonContent,IonIcon,IonButtons,IonButton,TranslateModule],
})
export class SeeAllComponent  implements OnInit {

  @Input() elementTitle: string = "";
  @Input() link: string = "";

  constructor(private router: Router) { }

  ngOnInit() {}

  onSearchClick() {
    this.router.navigate([this.link]);
  }

}
