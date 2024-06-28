import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  chevronCollapseOutline,
  chevronExpandOutline,
  ellipsisHorizontal,
  expand,
  heart,
  heartOutline,
  pauseCircle,
  playCircle,
  playSkipBackOutline,
  playSkipForwardOutline,
  repeat,
  shareOutline,
  shareSocialOutline,
  shuffle,
} from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonImg,
  IonRange,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MusicService } from 'src/app/core/services/music.service';
import { ISongWithDetails } from 'src/app/core/interfaces/song';
import { MusicplayerComponent } from '../musicplayer/musicplayer.component';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-smallplayer',
  templateUrl: './smallplayer.component.html',
  styleUrls: ['./smallplayer.component.scss'],
  imports: [
    IonCardContent,
    IonCard,
    IonRange,
    IonImg,
    IonIcon,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    MusicplayerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmallplayerComponent  implements OnInit {

  isPlaying: boolean = true;
  isOnRepeat: boolean = false;

  isPlaying$ = this.musicService.isPlaying();
  currentTrack: ISongWithDetails | null = null;
  progress$ = this.musicService.getProgress();
  currentTime$ = this.musicService.getCurrentTime();
  duration$ = this.musicService.getDuration();
  private subscriptions: Subscription[] = [];
  

  constructor(private musicService: MusicService,private modalController: ModalController,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    addIcons({
      repeat,
      shareOutline,
      heartOutline,
      shareSocialOutline,
      heart,
      playSkipBackOutline,
      playCircle,
      pauseCircle,
      playSkipForwardOutline,
      shuffle,
      ellipsisHorizontal,
      expand,
      chevronExpandOutline,
      chevronCollapseOutline
    });
    
    this.subscriptions.push(
      this.musicService.isPlaying().subscribe(isPlaying => {
        if (isPlaying) {
          this.currentTrack = this.musicService.getCurrentTrack();
          this.isPlaying = isPlaying;
          this.cdr.detectChanges();
        } else {
          this.currentTrack = null;
          this.cdr.detectChanges();
        }
      }),
      this.musicService.getIsOnRepeat().subscribe(isOnRepeat =>{
        this.isOnRepeat = isOnRepeat;
      })
    );
  }

  onRepeat() {
    this.musicService.toggleRepeat();
  }

  skipForward() {
    this.musicService.skipForward(30); // Skip forward by 30 seconds
  }

  skipBackward() {
    this.musicService.skipBackward(30); // Skip backward by 30 seconds
  }

  playMusic(event: Event) {
   console.log(this.isPlaying);
    if (this.isPlaying) {
      event.stopPropagation();
      this.musicService.isPlaying().subscribe(isPlaying => {
        if (this.currentTrack) {
          if (isPlaying) {
            this.musicService.pause();
          } else {
            this.musicService.play(this.currentTrack);
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  async openModal() {
    const song = this.musicService.getCurrentTrack();
    if (song) {
      const modal = await this.modalController.create({
        component: MusicplayerComponent,
        componentProps: { song }
      });
      await modal.present();
    }
  }

  stopMusic(event: Event) {
    event.stopPropagation();
    this.musicService.stop();
  }

  onIonChange(event: any) {
    this.musicService.onIonChange(event)
  }

}
