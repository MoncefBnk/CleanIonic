import { Component, OnInit } from '@angular/core';
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
  IonCardHeader
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MusicService } from 'src/app/core/services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.scss'],
  standalone: true,
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
  IonCardHeader
  ],
})
export class MusicplayerComponent  implements OnInit {
  private subscriptions: Subscription[] = [];
  isPlaying: boolean = true;
  currentTrack: string = "";
  currentTime: string = '0:00';
  duration: string = '0:00';
  progress: number = 0;
  currentLyric: string = '';
  isOnRepeat: boolean = false;

  constructor(private musicService: MusicService) { }

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
        this.isPlaying = isPlaying;
        this.currentTrack = this.musicService.getCurrentTrack();
      }),
      this.musicService.getCurrentTime().subscribe(currentTime => {
        this.currentTime = currentTime;
      }),
      this.musicService.getDuration().subscribe(duration => {
        this.duration = duration;
      }),
      this.musicService.getProgress().subscribe(progress =>{
        this.progress = progress;
      }),
      this.musicService.getCurrentLyric().subscribe(currentLyric =>{
        this.currentLyric = currentLyric;
      }),
      this.musicService.getIsOnRepeat().subscribe(isOnRepeat =>{
        this.isOnRepeat = isOnRepeat;
      })
    );
  }

  

  playMusic() {
    //this.musicService.play(trackUrl);
   console.log(this.isPlaying);
    if (this.isPlaying) {
      this.musicService.pause();

    } else {
      this.musicService.play('assets/songs/Wild_World.mp3');
    }
  }

  onRepeat() {
    this.musicService.toggleRepeat();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  skipForward() {
    this.musicService.skipForward(30); // Skip forward by 30 seconds
  }

  skipBackward() {
    this.musicService.skipBackward(30); // Skip backward by 30 seconds
  }

}
