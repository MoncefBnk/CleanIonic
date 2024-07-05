import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { ModalShareComponent } from '../../modal/modal-share/modal-share.component';
import { ModalController,LoadingController } from '@ionic/angular';
import { IElement } from 'src/app/core/interfaces/element';
import { addIcons } from 'ionicons';
import { shareSocialOutline,heart,heartOutline,ellipsisVertical } from 'ionicons/icons';
import { IonItem,IonText,IonImg,IonButton,IonIcon } from '@ionic/angular/standalone';
import { IAlbum, IAlbumsWithDetails } from 'src/app/core/interfaces/album';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { ISong, ISongWithDetails } from 'src/app/core/interfaces/song';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';
import { MusicplayerComponent } from '../../music/musicplayer/musicplayer.component';
import { IArtist } from 'src/app/core/interfaces/artist';
import { SongActionComponent } from '../../modal/song-action/song-action.component';


@Component({
  selector: 'app-horizontal-card-item',
  templateUrl: './horizontal-card-item.component.html',
  styleUrls: ['./horizontal-card-item.component.scss'],
  standalone:true,
  imports: [IonItem,IonText,IonButton,IonIcon,IonImg]

})
export class HorizontalCardItemComponent  implements OnInit {
  @Input() element = {} as IElement;
  @Input() album = {} as IAlbumsWithDetails;
  @Input() song = {} as ISongWithDetails;
  @Input() artist = {} as IArtist;
  @Input() playlist = {} as IPlaylist;

  data = {} as IElement;
  isIconDark: boolean = false;
  selectedItem: any;
  isFavorite: boolean = false;
  smallPlayerVisible = false;
  private serviceFirestore = inject(FirestoreService);

  constructor(private modalController: ModalController,private router: Router,private cdr: ChangeDetectorRef, private loadingController: LoadingController) { }

  ngOnInit() {
    addIcons({ shareSocialOutline,heart,heartOutline,ellipsisVertical });
    
    if(this.album.id) {
      this.updateElementFromAlbum();
    } else if(this.song.id) {
      this.updateElementFromSong();
    } else if(this.artist.id){
      this.updateElementFromArtist();
    } else if(this.playlist.id){
      this.element = {...this.playlist,type:'playlist'};
      this.data = this.element;
    } else {
      this.data = this.element;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['album'] && changes['album'].currentValue) {
      this.updateElementFromAlbum();
    } 
    if(changes['song'] && changes['song'].currentValue) {
      this.updateElementFromSong();
    } 
    if(changes['artist'] && changes['artist'].currentValue) {
      this.updateElementFromArtist();
    } 
  }

  updateElementFromArtist() {
    this.data = {
      type: 'artist',
      id: this.artist.id,
      label: this.artist.label,
      artistName: this.artist.artist,
      nbrAlbum: this.artist.albums? this.artist.albums.length : 0,
      cover: this.artist.avatar
    };
  }

  updateElementFromAlbum() {
    this.data = {
      type: 'album',
      id: this.album.id,
      albumName: this.album.title,
      artistName: this.album.artist.artist,
      year: this.album.year,
      cover: this.album.cover
    };
  }

  updateElementFromSong() {
    this.data = {
      type: 'song',
      id: this.song.id,
      artistName: this.song.artist.artist,
      albumName: this.song.album?this.song.album.title:'',
      songtitle: this.song.title,
      cover: this.song.cover
    };
  }

  async openModal(event: Event,item: any) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: ModalShareComponent,
      id:"share-modal"

    });
    return await modal.present();
  }

  makeFavorite(event: Event) {
    event.stopPropagation(); 
    this.isFavorite = !this.isFavorite;
  }

  async  playmusic(id:string) {
    await this.serviceFirestore.getOneSong(id).then(music => {
        if(music)
          this.song = music;
      });

    const modal = await this.modalController.create({
      component: MusicplayerComponent,
      componentProps: {
        song: this.song
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.minimized) {
        this.smallPlayerVisible = true;
      }
    });
    this.cdr.detectChanges();
    return await modal.present();
  }

  async  showSongActions(data: any) {
    console.log(data);
    const modal = await this.modalController.create({
      component: SongActionComponent,
      breakpoints: [0, .5],
      initialBreakpoint: .25,
      componentProps: {
        songId: data.id,
        artistId: this.song.artist.id,
        dismissModal: () => modal.dismiss()
      }
    });

    this.cdr.detectChanges();
    return await modal.present();
  }

  async navigateArtist(id:string) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 7000
    });

    await loading.present();
    this.router.navigate(['artist'], { queryParams: {id:id}});
    loading.dismiss();
  }

  handleItemClick(data: any) {
    if (data.type === 'song') {
      this.playmusic(data.id);
    } else if (data.type === 'album') {
      //this.navigateToAlbum(data.id);
      console.log('album');
    } else if (data.type === 'artist') {
      this.navigateArtist(data.id);
    }
  }

  handleIconClick(event: Event, data: any) {
    event.stopPropagation(); 
    if (data.type === 'song') {
      this.showSongActions(data);
    } else if (data.type === 'album') {
      //this.navigateToAlbum(data.id);
      console.log('album');
    } else if (data.type === 'artist') {
      this.navigateArtist(data.id);
    }
  }
}
