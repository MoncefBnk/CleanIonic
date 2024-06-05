import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { Component } from '@angular/core';
import { IonRouterLinkWithHref,IonRouterLink,IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward,search,arrowForwardOutline } from 'ionicons/icons';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong } from 'src/app/core/interfaces/song';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { SeeAllComponent } from 'src/app/shared/header/see-all/see-all.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { SwitchableButtonsComponent } from 'src/app/shared/switchable-buttons/switchable-buttons.component';
import { VerticalCardComponent } from 'src/app/shared/vertical-card/vertical-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    GeneralHeaderComponent,
    SwitchableButtonsComponent,
    VerticalCardComponent,
    SeeAllComponent,
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

  start_icon : string = "search";
  end_icon : string = "search";
  image : string = "assets/icon/logo_mini.png";

  musiccateg : string[] = ["All","R&B","Pop","Rock"];
  elementTitles : string[] = ["Music Genres","Top Songs","Last Played","Top Albums", "Top Artists","Top Playlist"];
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

  getInitials(firstName:string, lastName:string) {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }
}
