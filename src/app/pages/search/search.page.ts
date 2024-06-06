import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,GeneralHeaderComponent]
})
export class SearchPage implements OnInit {

  end_icon : string = "search";
  title : string = "Recherche";
  backbutton : string = "back";

  constructor() { }

  ngOnInit() {
  }

}
