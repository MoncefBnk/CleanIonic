import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';

@Component({
  selector: 'app-musicplaylist',
  templateUrl: './musicplaylist.page.html',
  styleUrls: ['./musicplaylist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,GeneralHeaderComponent]
})
export class MusicplaylistPage implements OnInit {

  backbutton : string = "back";
  end_icon : string = "ellipsis-horizontal";
  title : string = "Playlist Music";
  constructor() { }

  ngOnInit() {
  }

}
