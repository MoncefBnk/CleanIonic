import { ExploreContainerComponent } from './../../explore-container/explore-container.component';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ISong } from 'src/app/core/interfaces/song';
import { Horizontal2CardComponent } from 'src/app/shared/horizontal2-card/horizontal2-card.component';


@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,Horizontal2CardComponent],
})
export class PlaylistPage {
  constructor() {}
  playlists : ISong[] = [
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1},
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1},
    { cover : "assets/test.jpg", title: "test", createdAt:new Date("12-02-10") ,id: 1}
  ];
}
