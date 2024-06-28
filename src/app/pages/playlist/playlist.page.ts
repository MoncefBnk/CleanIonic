import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from './../../explore-container/explore-container.component';
import { Component, inject } from '@angular/core';

import {
  IonItem,
  IonLabel,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { IElement } from 'src/app/core/interfaces/element';


@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
  standalone: true,

  imports: [IonItem,IonLabel,IonText,IonHeader, IonToolbar, IonTitle, IonContent, IonList, ExploreContainerComponent,Horizontal1CardComponent,GeneralHeaderComponent,TranslateModule,CommonModule],

})
export class PlaylistPage {
  constructor() {}

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  title: string = 'Music Playlist';
  end_icon: string = 'ellipsis-horizontal';

  playlists: IPlaylist[] = [];
  user = {} as IUser;

  ngOnInit() {
    this.getUser();
    this.serviceFirestore.getTopPlaylist(this.user.id, 5).then((playlists) => {
      if (playlists) this.playlists = playlists;
    });
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser> =
      this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if (userdata) {
      this.user = userdata;
    }
  }
}
