import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private audio: HTMLAudioElement;
  private currentTrack: string = "";
  private isPlayingSubject: BehaviorSubject<boolean>;
  private currentTimeSubject: BehaviorSubject<string>;
  private progressSubject: BehaviorSubject<number>;
  private currentLyricSubject: BehaviorSubject<string>;
  private durationSubject: BehaviorSubject<string>;

  lyrics: string[] = [
    '...la-la-la-la-la-la-la, la, la La-la-la-la-la-la-la-la la la-la',
    "Now that I've lost everything to you You say you wanna start something new And it's breakin' my heart you're leavin' Baby, I'm grievin' But if you wanna leave, take good care Hope you have a lot of nice things to wear But then a lot of nice things turn bad out there",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world I'll always remember you like a child, girl ",
    "You know I've seen a lot of what the world can do And it's breakin' my heart in two Because I never wanna see you sad, girl Don't be a bad girl But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware",
    "Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
    " ...la-la-la-la-la-la-la, la, la La-la-la-la-la-la-la-la la la-la, la Baby, I love you But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware Beware",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
  ];

  constructor() {
    this.audio = new Audio();
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

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
      this.currentTimeSubject.next('0:00');
      this.currentLyricSubject.next('');
      this.durationSubject.next('0:00');
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.formatTime(this.audio.duration));
    });
  }

  play(trackUrl: string) {
    if (this.currentTrack !== trackUrl) {
      this.audio.src = trackUrl;
      this.audio.load();
      this.audio.play();
      this.currentTrack = trackUrl;
    } else if (this.audio.paused) {
      this.audio.play();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
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

  getCurrentTrack() {
    return this.currentTrack;
  }

  getProgress(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  getCurrentTime(): Observable<string> {
    return this.currentTimeSubject.asObservable();
  }

  getCurrentLyric(): Observable<string> {
    return this.currentLyricSubject.asObservable();
  }

  getLyric(currentTime: number): string {
    const timeIntervals = [
      { start: 0, end: 11, lyric: this.lyrics[0] },
      { start: 12, end: 39, lyric: this.lyrics[1] },
      { start: 40, end: 64, lyric: this.lyrics[2] },
      { start: 65, end: 91, lyric: this.lyrics[3] },
      { start: 92, end: 118, lyric: this.lyrics[4] },
      { start: 121, end: 145, lyric: this.lyrics[5] },
      { start: 146, end: this.audio.duration, lyric: this.lyrics[6] },
    ];

    for (let interval of timeIntervals) {
      if (currentTime >= interval.start && currentTime <= interval.end) {
        return interval.lyric;
      }
    }

    return '[instruments playing]';
  }

  getDuration(): Observable<string> {
    return this.durationSubject.asObservable();
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    const currentTime = this.formatTime(this.audio.currentTime);
    const currentLyric = this.getLyric(this.audio.currentTime);

    this.progressSubject.next(progress);
    this.currentTimeSubject.next(currentTime);
    this.currentLyricSubject.next(currentLyric);
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
}