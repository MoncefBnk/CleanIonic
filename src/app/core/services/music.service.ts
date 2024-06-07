import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private audio: HTMLAudioElement;
  private currentTrack: string = "";

  constructor() {
    this.audio = new Audio();
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
    }
  }

  isPlaying() {
    return !this.audio.paused;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }
}