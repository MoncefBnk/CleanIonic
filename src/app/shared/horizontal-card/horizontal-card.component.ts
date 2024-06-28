import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { ModalShareComponent } from '../modal/modal-share/modal-share.component';
import { ModalController } from '@ionic/angular';
import { IElement } from 'src/app/core/interfaces/element';
import { addIcons } from 'ionicons';
import { shareSocialOutline,heart,heartOutline,ellipsisVertical } from 'ionicons/icons';
import { IonItem,IonText,IonImg,IonButton,IonIcon } from '@ionic/angular/standalone';
import { IAlbum } from 'src/app/core/interfaces/album';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { ISong } from 'src/app/core/interfaces/song';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';
import { MusicplayerComponent } from '../musicplayer/musicplayer.component';


@Component({
  selector: 'app-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss'],
  standalone:true,
  imports: [IonItem,IonText,IonButton,IonIcon,IonImg]

})
export class HorizontalCardComponent  implements OnInit {
  @Input() element = {} as IElement;
  @Input() album = {} as IAlbum;
  @Input() song = {} as ISong;
  @Input() playlist = {} as IPlaylist;

  data = {} as IElement;
  isIconDark: boolean = false;
  selectedItem: any;
  isFavorite: boolean = false;
  smallPlayerVisible = false;
  private serviceFirestore = inject(FirestoreService);

  constructor(private modalController: ModalController,private router: Router,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    addIcons({ shareSocialOutline,heart,heartOutline,ellipsisVertical });
    
    if(this.album.id) {
      this.updateElementFromAlbum();
    } else if(this.song.id) {
      this.updateElementFromSong();
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
  }

  updateElementFromAlbum() {
    this.data = {
      type: 'album',
      id: this.album.id,
      albumName: this.album.title,
      artistName: this.album.artistId,
      year: this.album.year,
      cover: this.album.cover
    };
    console.log(this.album);
  }

  updateElementFromSong() {
    this.data = {
      type: 'song',
      id: this.song.id,
      artistName: this.song.artistId,
      songtitle: this.song.title,
      cover: this.song.cover
    };
  }

  async openModal(item: any) {
    const modal = await this.modalController.create({
      component: ModalShareComponent,
    });
    return await modal.present();
  }

  makeFavorite() {
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
}
