import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  arrowBackOutline
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
import { ISongWithDetails } from "src/app/core/interfaces/song";
import { MusicService } from 'src/app/core/services/music.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalShareComponent } from 'src/app/shared/modal/modal-share/modal-share.component';


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
  currentTrack : ISongWithDetails[]=[];
  currentTime: string = '0:00';
  duration: string = '0:00';
  progress: number = 0;
  currentLyric: string = '';
  isOnRepeat: boolean = false;

  backbutton: string = "back";
  end_icon: string = "ellipsis-horizontal";
  //song = {} as ISongWithDetails;
  audio!: HTMLAudioElement;
  isFavorite: boolean = false;
  allLyrics: string = '';
  start_icon: string = 'search';
  image: string = 'assets/icon/logo_mini.png';
  isExpanded: boolean = false;

  @Input() song= {} as ISongWithDetails;

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
      chevronCollapseOutline,
      arrowBackOutline
    });

    this.subscriptions.push(
      this.musicService.isPlaying().subscribe(isPlaying => {
        this.isPlaying = isPlaying;
        this.cdr.detectChanges();
        //this.currentTrack = this.musicService.getCurrentTrack();
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
    //console.log(this.song);
  }

  

  playMusic(song:ISongWithDetails) {
    //this.musicService.play(trackUrl);
   console.log(this.isPlaying);
    if (this.isPlaying) {
      this.musicService.pause();

    } else {
      this.musicService.play(song);
    }
  }

  initPlayer() {
    this.musicService.play(this.song);
  }

  onRepeat() {
    this.musicService.toggleRepeat();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  onIonChange(event: any) {
    this.musicService.onIonChange(event)
  }

  makeFavorite() {
    this.isFavorite = !this.isFavorite;
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

 /* async openModal(item: any) {
    const modal = await this.modalController.create({
      component: ModalShareComponent,
    });
    return await modal.present();
  }*/

    minimize() {
      this.modalController.dismiss({
        minimized: true
      });
    }

}
