import { Component, Input, OnInit, inject } from '@angular/core';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong, ISongWithDetails } from 'src/app/core/interfaces/song';
import { IonText,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IArtist } from 'src/app/core/interfaces/artist';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';



@Component({
  standalone: true,
  selector: 'app-vertical-card',
  templateUrl: './vertical-card.component.html',
  styleUrls: ['./vertical-card.component.scss'],
  imports : [
    IonItem,
    IonList,
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid,
    IonText,
    CommonModule
  ]
})
export class VerticalCardComponent  implements OnInit {

  @Input() albums: IAlbum[] = [];
  @Input() songs: ISongWithDetails[] = [];
  @Input() artists: IArtist[] =[];
  song = {} as ISongWithDetails;
  private serviceFirestore = inject(FirestoreService);

  constructor(private router: Router) { 
      
  }

  ngOnInit() {}

  async playmusic(id:string) {
    await this.serviceFirestore.getOneSong(id).then(music => {
      if(music)
        this.song = music;
    });

  const navigationExtras = {
    queryParams: {
      song: JSON.stringify(this.song)  // The object you want to send
    }
  };
  this.router.navigate(['player'], navigationExtras);
  }

}
