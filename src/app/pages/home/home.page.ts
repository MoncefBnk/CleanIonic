import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { Component } from '@angular/core';
import { IonRouterLinkWithHref,IonRouterLink,IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward,search,arrowForwardOutline } from 'ionicons/icons';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong } from 'src/app/core/interfaces/song';
import { SeeAllComponent } from 'src/app/shared/header/see-all/see-all.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { RoundMenuComponent } from 'src/app/shared/round-menu/round-menu.component';
import { VerticalCardComponent } from 'src/app/shared/vertical-card/vertical-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    VerticalCardComponent,
    SeeAllComponent,
    RoundMenuComponent,
    Horizontal1CardComponent,
    IonText,
    IonItem,
    IonList,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid, 
    IonContent,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    ExploreContainerComponent,
    IonIcon,
    IonButtons,
    IonButton,
    IonRouterLink
    
  ],

})
export class HomePage {
  constructor() {
    addIcons({ search,arrowForward,arrowForwardOutline });
  }

  musiccateg : string[] = ["All","R&B","Pop","Rock"];
  elementTitles : string[] = ["Music Genres","Top Songs","Last Played","Top Albums", "Top Artists"];
  songs : ISong[] = [
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1},
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1},
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1}
  ];
  albums : IAlbum[] = [
    { cover : "assets/test.jpg", nom: "test",categ:"",label:"",year:"", createdAt:new Date("12-02-10") ,id: 1,songs: []},
    { cover : "assets/test.jpg", nom: "test",categ:"",label:"",year:"", createdAt:new Date("12-02-10") ,id: 1,songs: []},
    { cover : "assets/test.jpg", nom: "test",categ:"",label:"",year:"", createdAt:new Date("12-02-10") ,id: 1,songs: []}
  ];
}
