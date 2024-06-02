import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonGrid,IonCol,IonRow,IonText,IonButton,IonItem,IonList } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-switchable-buttons',
  templateUrl: './switchable-buttons.component.html',
  styleUrls: ['./switchable-buttons.component.scss'],
  imports: [
    SwitchableButtonsComponent,
    IonButton,
    IonItem,
    IonList,
    IonText,
    IonRow,
    IonCol,
    IonGrid,
    CommonModule
  ],
})
export class SwitchableButtonsComponent  implements OnInit {

  categories : string[] = ["All","R&B","Pop","Rock"];
  selectedButton: number | null = 0;

  constructor() { }

  ngOnInit() {}

  toggleButton(index: number) {
    this.selectedButton = this.selectedButton === index ? null : index;
  }

}
