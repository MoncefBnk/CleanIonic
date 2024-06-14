import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
} from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
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
import { ISongWithDetails } from "src/app/core/interfaces/song";
import { MusicService } from 'src/app/core/services/music.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalShareComponent } from 'src/app/shared/modal/modal-share/modal-share.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
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
    FormsModule,
    GeneralHeaderComponent,
    ModalShareComponent
  ],
})
export class PlayerPage implements OnInit {
  currentTrack: string = "";
  private subscriptions: Subscription[] = [];


  @ViewChild('audioPlayer', { static: false }) audioPlayer: any;
  backbutton: string = "back";
  end_icon: string = "ellipsis-horizontal";
  song = {} as ISongWithDetails;
  audio!: HTMLAudioElement;
  isFavorite: boolean = false;
  isPlaying: boolean = true;
  currentTime: string = '0:00';
  duration: string = '0:00';
  progress: number = 0;
  currentLyric: string = '';
  isOnRepeat: boolean = false;
  allLyrics: string = '';
  start_icon: string = 'search';
  image: string = 'assets/icon/logo_mini.png';
  isExpanded: boolean = false;

  constructor(private route: ActivatedRoute, private musicService: MusicService,private modalController: ModalController) {
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
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['song']) {
        this.song = JSON.parse(params['song']);
        console.log(this.song);
      }
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
    this.initPlayer();
  }


  playMusic(trackUrl: string) {
    //this.musicService.play(trackUrl);
   console.log(this.isPlaying);
    if (this.isPlaying) {
      this.musicService.pause();

    } else {
      this.musicService.play('assets/songs/Wild_World.mp3');
    }
  }

  initPlayer() {
    this.musicService.play('assets/songs/Wild_World.mp3');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }

  onIonChange(event: any) {
    this.musicService.onIonChange(event)
  }

  onRepeat() {
    this.musicService.toggleRepeat();
  }

  makeFavorite() {
    this.isFavorite = !this.isFavorite;
  }


  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  toggleExpand() {
    console.log(this.isExpanded);
    if(!this.isExpanded) {
      this.allLyrics = this.musicService.getAllLyrics();

    } else {
      this.musicService.getCurrentLyric().subscribe(currentLyric =>{
        this.currentLyric = currentLyric;
      })
    }

    this.isExpanded = !this.isExpanded;
  }

  skipForward() {
    this.musicService.skipForward(30); // Skip forward by 30 seconds
  }

  skipBackward() {
    this.musicService.skipBackward(30); // Skip backward by 30 seconds
  }

  async openModal(item: any) {
    const modal = await this.modalController.create({
      component: ModalShareComponent,
    });
    return await modal.present();
  }

}
