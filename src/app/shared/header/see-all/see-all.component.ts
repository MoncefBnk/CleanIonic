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
  @Input() type: string = "all";

  constructor(private router: Router) { }

  ngOnInit() {}

  onSearchClick(type:string) {
    this.router.navigate([this.link], { queryParams: {type:type}});
    //this.router.navigate(['music-playlist'], { queryParams: {id:id}});
  }

}
