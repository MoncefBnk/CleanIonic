import { ExploreContainerComponent } from './../../explore-container/explore-container.component';
import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg } from '@ionic/angular/standalone';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { Horizontal2CardComponent } from 'src/app/shared/horizontal2-card/horizontal2-card.component';


@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
  standalone: true,
  imports: [IonImg, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,Horizontal2CardComponent,GeneralHeaderComponent],
})
export class PlaylistPage {
  constructor() {}

  private serviceFirestore = inject(FirestoreService);
  title : string = "Music Playlist"
  end_icon : string = "ellipsis-horizontal";
  playlists : IPlaylist[] = [];

  ngOnInit() {
    this.serviceFirestore.getTopPlaylist('qfxEo314Ql3IhTZfvGBU',5).then(playlists => {
      this.playlists = playlists;
    });
    console.log(this.playlists);
  }
}
