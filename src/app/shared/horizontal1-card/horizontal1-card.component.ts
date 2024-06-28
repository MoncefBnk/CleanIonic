import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { ISong,ISongWithDetails } from 'src/app/core/interfaces/song';
import { IonLabel,IonNote,IonText,IonButton,IonButtons,IonIcon,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ILastPlayedWithDetails, IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { ModalController } from '@ionic/angular';
import { MusicplayerComponent } from '../musicplayer/musicplayer.component';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  standalone: true,
  selector: 'app-horizontal1-card',
  templateUrl: './horizontal1-card.component.html',
  styleUrls: ['./horizontal1-card.component.scss'],
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
    CommonModule
  ]
})
export class Horizontal1CardComponent  implements OnInit {

  @Input() lastPlayeds: ILastPlayedWithDetails[]|null = [];
  @Input() playlists: IPlaylist[] =[];
  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  song = {} as ISongWithDetails;
  smallPlayerVisible = false;
  user = {} as IUser;
  
  constructor(private router: Router,private modalController: ModalController,private cdr: ChangeDetectorRef ) {
    addIcons({ ellipsisHorizontal });
   }

  ngOnInit() {
    this.getUser();
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
    
    await this.serviceFirestore.updateLastPlayed(this.user.id,id);
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

   navigatetoPlaylist(id:string) {
   /* await this.serviceFirestore.getOneSong(id).then(music => {
      if(music)
        this.song = music;
    });

    const navigationExtras = {
      queryParams: {
        song: JSON.stringify(this.song)  // The object you want to send
      }
    };*/
    this.router.navigate(['music-playlist'], { queryParams: {id:id}});
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }

}
