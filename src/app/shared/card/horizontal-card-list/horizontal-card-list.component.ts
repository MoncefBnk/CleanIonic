import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { ISong,ISongWithDetails } from 'src/app/core/interfaces/song';
import { IonHeader,IonLabel,IonNote,IonText,IonButton,IonButtons,IonIcon,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ILastPlayedWithDetails, IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';
import { ModalController,LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MusicplayerComponent } from '../../music/musicplayer/musicplayer.component';
import { UserService } from 'src/app/core/services/user.service';
import { SongService } from 'src/app/core/services/song.service';

@Component({
  standalone: true,
  selector: 'app-horizontal-card-list',
  templateUrl: './horizontal-card-list.component.html',
  styleUrls: ['./horizontal-card-list.component.scss'],
  imports : [
    IonLabel,
    IonNote,
    IonItem,
    IonList,
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid,
    IonIcon,
    IonButton,
    IonButtons,
    IonText,
    IonHeader,
    CommonModule
  ]
})
export class HorizontalCardListComponent  implements OnInit {

  @Input() lastPlayeds: ILastPlayedWithDetails[]|null = [];
  @Input() playlists: IPlaylist[] =[];
  private userService = inject(UserService);
  private localStore = inject(LocalStorageService);
  private songService = inject(SongService);

  song = {} as ISongWithDetails;
  smallPlayerVisible = false;
  user = {} as IUser;
  
  constructor(private router: Router,private modalController: ModalController,private cdr: ChangeDetectorRef, private loadingController: LoadingController ) {
    addIcons({ ellipsisHorizontal });
   }

  ngOnInit() {
    this.getUser();
    console.log(this.playlists);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const formattedTime = [
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');

    return formattedTime;
  }

  async  playmusic(id:string) {
    
    await this.userService.updateLastPlayed(this.user.id,id);
    await this.songService.getOneSong(id).then(music => {
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

  async navigatetoPlaylist(id:string) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 7000
    });

    await loading.present();
    this.router.navigate(['music-playlist'], { queryParams: {id:id}});
    loading.dismiss();
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }


  ngOnDestroy() {
    console.log('HomePage destroyed');
  }

}
