import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonText,IonButton,IonItem,IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-round-menu',
  standalone: true,
  templateUrl: './round-menu.component.html',
  styleUrls: ['./round-menu.component.scss'],
  imports: [
    RoundMenuComponent,
    IonButton,
    IonItem,
    IonList,
    IonText,
    CommonModule
  ],
})
export class RoundMenuComponent  implements OnInit {

  @Input() nbrElement: number = 4;
  @Input() elementArray: string[] = [];
  constructor() { }

  ngOnInit() {}

}
