import { CommonModule } from '@angular/common';
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
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { IElement } from 'src/app/core/interfaces/element';
import { HorizontalCardListComponent } from 'src/app/shared/card/horizontal-card-list/horizontal-card-list.component';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
  standalone: true,

  imports: [IonItem,IonLabel,IonText,IonHeader, IonToolbar, IonTitle, IonContent, IonList,HorizontalCardListComponent,GeneralHeaderComponent,TranslateModule,CommonModule],

})
export class PlaylistPage {
  constructor() {}

  private userService = inject(UserService);
  private localStore = inject(LocalStorageService);

  title: string = 'Music Playlist';
  end_icon: string = 'ellipsis-horizontal';

  playlists: IPlaylist[] = [];
  user = {} as IUser;

  ngOnInit() {
    this.getUser();
    this.userService.getTopPlaylist(this.user.id, 5).then((playlists) => {
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
