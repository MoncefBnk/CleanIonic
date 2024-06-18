import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { MusicplayerComponent } from './shared/musicplayer/musicplayer.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,MusicplayerComponent],
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  displayplayer: boolean = false;
  

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.translate.use('en_US');
    this.translate.setDefaultLang('en_US');

   /* this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if(event.url.startsWith('/player') || event.url ==='/auth/login' || event.url ==='/auth/register') {
          this.displayplayer = false;
        } else {
          this.displayplayer = true;
        }
      }
    });*/
  }
}
