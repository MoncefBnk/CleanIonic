import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, musicalNotes, person, home } from 'ionicons/icons';
import { AlbumService } from 'src/app/core/services/album.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  private albumsService = inject(AlbumService);
  constructor() {
    this.albumsService.getAlbums2();
    addIcons({ home, heartOutline, musicalNotes,person });
  }
}
