import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  constructor() {}
  ngOnInit(): void {
    this.translate.use('en_US');
    this.translate.setDefaultLang('en_US');
  }
}
