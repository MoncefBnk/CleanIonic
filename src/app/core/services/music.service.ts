import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILyric, ISongWithDetails } from '../interfaces/song';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private audio: HTMLAudioElement;
  private currentTrack: ISongWithDetails | null = null;
  private trackQueue: ISongWithDetails[] = [];
  private currentIndex: number = 0;
  private isOnRepeat: BehaviorSubject<boolean>;
  private isPlayingSubject: BehaviorSubject<boolean>;
  private currentTimeSubject: BehaviorSubject<string>;
  private progressSubject: BehaviorSubject<number>;
  private currentLyricSubject: BehaviorSubject<string>;
  private durationSubject: BehaviorSubject<string>;

  private apiservice = inject(ApiService);


  lyrics : ILyric[]=[];

  constructor() {
    this.audio = new Audio();
    this.isOnRepeat = new BehaviorSubject<boolean>(false);
    this.isPlayingSubject = new BehaviorSubject<boolean>(false);
    this.progressSubject = new BehaviorSubject<number>(0);
    this.currentTimeSubject = new BehaviorSubject<string>('0:00');
    this.currentLyricSubject = new BehaviorSubject<string>('');
    this.durationSubject = new BehaviorSubject<string>('0:00');


    this.audio.addEventListener('playing', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });

    this.isOnRepeat.subscribe((isOnRepeat) => {
      this.audio.loop = isOnRepeat;
    });


    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
      this.currentTimeSubject.next('0:00');
      this.currentLyricSubject.next('');
      if (this.isOnRepeat.value) {
        this.audio.currentTime = 0;
        this.audio.play();
      }else {
        this.playNext();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.formatTime(this.audio.duration));
    });
  }

  toggleRepeat() {
    this.isOnRepeat.next(!this.isOnRepeat.value);
  }

  async play(track: ISongWithDetails) {
    if (!this.currentTrack || this.currentTrack.id !== track.id) {
      this.stop();
      await this.load(track.id);
      this.audio.play();
      this.currentTrack = track;
      this.isPlayingSubject.next(true);
      this.trackQueue.push(track);
      if( track.lyrics)
        this.lyrics = track.lyrics;

    } else if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
      if( track.lyrics)
        this.lyrics = track.lyrics;
    }
  }

  playAll(tracks: ISongWithDetails[]) {
    this.trackQueue = tracks;
    this.currentIndex = 0;
    if (this.trackQueue.length > 0) {
      this.play(this.trackQueue[this.currentIndex]);
    }
  }

  addToQueue(track: ISongWithDetails) {
    console.log(track,this.currentIndex);
    this.trackQueue.push(track);
    if (this.currentIndex === 0) {
      //this.currentIndex = 0;
      this.playNext();
    }
  }

  playNext() {
    if (this.currentIndex >= 0 && this.currentIndex < this.trackQueue.length) {
      const nextTrack = this.trackQueue[this.currentIndex];
      this.currentIndex++;
      this.play(nextTrack);
    }
  }

  playPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.play(this.trackQueue[this.currentIndex]);
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop() {
    if (this.audio) {
      this.pause();

      this.audio.currentTime = 0;
      this.currentTrack = null;
      this.lyrics = [];
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
      this.currentTimeSubject.next('0:00');
      this.currentLyricSubject.next('');
      this.durationSubject.next('0:00');
      
    }
  }

  isPlaying() {
    return this.isPlayingSubject.asObservable();
  }


  getCurrentTrack(): ISongWithDetails | null {
    return this.currentTrack;
  }

  getProgress(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  getIsOnRepeat(): Observable<boolean> {
    return this.isOnRepeat.asObservable();
  }

  getCurrentTime(): Observable<string> {
    return this.currentTimeSubject.asObservable();
  }

  getCurrentLyric(): Observable<string> {
    return this.currentLyricSubject.asObservable();
  }

  getLyric(currentTime: number): string {
    for (let interval of this.lyrics) {
      if (currentTime >= interval.start && currentTime <= interval.end) {
        return interval.lyric;
      }
    }

    return '[instruments playing]';
  }

  getDuration(): Observable<string> {
    return this.durationSubject.asObservable();
  }

  getAllLyrics(): string {
   return this.lyrics.map(part => part.lyric).join(' ');
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    const currentTime = this.formatTime(this.audio.currentTime);
    const currentLyric = this.getLyric(this.audio.currentTime);

    this.progressSubject.next(progress);
    this.currentTimeSubject.next(currentTime);
    this.currentLyricSubject.next(currentLyric);
  }

  onIonChange(event: any) {
    const value = event.detail.value;
    const seekTime = (value / 100) * this.audio.duration;
    this.audio.currentTime = seekTime;
  }


  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  skipForward(seconds: number) {
    this.audio.currentTime = Math.min(this.audio.currentTime + seconds, this.audio.duration);
  }

  skipBackward(seconds: number) {
    this.audio.currentTime = Math.max(this.audio.currentTime - seconds, 0);
  }

  load(id:string = ''): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.apiservice.getSongById(id).subscribe(
        blob => {
          const url = window.URL.createObjectURL(blob);
          this.audio.src = url;
          this.audio.load(); 
          resolve();
        }
      );
    });
   
  }

}