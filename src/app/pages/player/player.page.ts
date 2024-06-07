import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangeCustomEvent } from '@ionic/angular';
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
  IonRange, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { addIcons } from 'ionicons';
import {
  ellipsisHorizontal,
  expand,
  heart,
  heartCircleOutline,
  heartCircleSharp,
  heartOutline,
  pause,
  pauseCircle,
  play,
  playCircle,
  playSkipBack,
  playSkipBackOutline,
  playSkipForward,
  playSkipForwardOutline,
  repeat,
  repeatOutline,
  shareOutline,
  shareSocialOutline,
  shuffle,
} from 'ionicons/icons';
import { ISongWithDetails } from 'src/app/core/interfaces/song';


@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard,
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
  ],
})
export class PlayerPage implements OnInit {
  constructor(private route: ActivatedRoute) {
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
    });
  }

 
  backbutton : string = "back";
  end_icon : string = "ellipsis-horizontal";
  song = {} as ISongWithDetails;
  isFavorite: boolean = false;
  isPlaying: boolean = true;
  lyrics: string[] = [
    "Now that I've lost everything to you You say you wanna start something new And it's breakin' my heart you're leavin' Baby, I'm grievin' But if you wanna leave, take good care Hope you have a lot of nice things to wear But then a lot of nice things turn bad out there",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world I'll always remember you like a child, girl ",
    "You know I've seen a lot of what the world can do And it's breakin' my heart in two Because I never wanna see you sad, girl Don't be a bad girl But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware",
    "Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
    " ...la-la-la-la-la-la-la, la, la La-la-la-la-la-la-la-la la la-la, la Baby, I love you But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware Beware",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
  ];
  currentLyric: string = 'No Lyrics Found';
  start_icon: string = 'search';
 
  image: string = 'assets/icon/logo_mini.png';

  playMusic() {
    this.isPlaying = !this.isPlaying;
  }

  onIonChange(event: any) {
    const value = event.detail.value;
    const lyricIndex = Math.floor(value / (100 / this.lyrics.length));
    this.currentLyric = this.lyrics[lyricIndex];
  }

  makeFavorite() {
    this.isFavorite = !this.isFavorite;
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['song']) {
        this.song = JSON.parse(params['song']);
        console.log(this.song);
      }
    });
  }
}
