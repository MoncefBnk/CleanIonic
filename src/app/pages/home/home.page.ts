import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { Component, inject } from '@angular/core';
import { IonRouterLinkWithHref,IonRouterLink,IonText,IonItem,IonList,IonCard,IonCardContent,IonAvatar,IonImg, IonRow, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,IonButtons,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward,search,arrowForwardOutline } from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';
import { IAlbum, IAlbumsWithDetails } from 'src/app/core/interfaces/album';
import { IArtist } from 'src/app/core/interfaces/artist';
import { ISong, ISongWithDetails } from 'src/app/core/interfaces/song';
import { ILastPlayedWithDetails, IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { SeeAllComponent } from 'src/app/shared/header/see-all/see-all.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { SwitchableButtonsComponent } from 'src/app/shared/switchable-buttons/switchable-buttons.component';
import { VerticalCardComponent } from 'src/app/shared/vertical-card/vertical-card.component';


interface LinkItem {
  title: string;
  link: string;
}

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

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  start_icon : string = "search";
  end_icon : string = "search";
  initial : string = this.getInitials();

  musiccateg : string[] = ["All","R&B","Pop","Rock"];
  elementTitles: LinkItem[] = [
    {
      title: 'Music Genres',
      link: 'search'
    },
    {
      title: 'Top Songs',
      link: '/search'
    },
    {
      title: 'Last Played',
      link: '/search'
    },
    {
      title: 'Top Albums',
      link: '/search'
    },
    {
      title: 'Top Artists',
      link: '/search'
    },
    {
      title: 'Top Playlist',
      link: '/search'
    }
  ];
  songs : ISongWithDetails[]=[];
  lastPlayeds: ILastPlayedWithDetails[]=[];
  albums : IAlbumsWithDetails[] = [];
  artists : IArtist[] =[];
  playlists : IPlaylist[] =[];
  latestAlbum = {} as IAlbum;

  ngOnInit() {
    this.serviceFirestore.getTopSongsWithDetails(5).then(songs => {
      this.songs = songs;
    });
    this.serviceFirestore.getTopAlbums(5).then(albums => {
      if(albums)
        this.albums = albums;
    });
    this.serviceFirestore.getLastPlayed('qfxEo314Ql3IhTZfvGBU',5).then(lastsongs => {
      if(lastsongs)
        this.lastPlayeds = lastsongs;
    });
    this.serviceFirestore.getTopArtists(5).then(artists => {
      if(artists)
        this.artists = artists;
    });
    this.serviceFirestore.getTopPlaylist('qfxEo314Ql3IhTZfvGBU',5).then(playlists => {
      if(playlists)
        this.playlists = playlists;
    });
    this.serviceFirestore.getLatestAlbum().then(latest => {
      if(latest)
        this.latestAlbum = latest;
    });
console.log(this.playlists);
    console.log(this.songs);
  }

  getInitials() {

    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const user = userSubject.getValue();
    if (user) {
      // Parse the JSON string back into an object
      //const user = JSON.parse(user);
      if (user.firstname && user.lastname) {
        console.log(user);
        return user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase();
      }
    }
    return '';
  }

}
