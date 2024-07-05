import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';

import { register } from 'swiper/element/bundle';
import { SmallplayerComponent } from './shared/music/smallplayer/smallplayer.component';
import { MusicService } from './core/services/music.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,SmallplayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);

  displayplayer: boolean = false;
  

  constructor(private router: Router,private musicService: MusicService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.translate.use('en_US');
    this.translate.setDefaultLang('en_US');

    this.musicService.isPlaying().subscribe(isPlaying => {
      this.displayplayer = this.musicService.getCurrentTrack() !== null &&
                             (isPlaying || this.musicService.isTrackPaused()) &&
                             this.musicService.hasQueue();
      console.log(this.displayplayer);
      this.cdr.detectChanges();
    })
    console.log(this.musicService.getCurrentTrack());
    
  }
}
