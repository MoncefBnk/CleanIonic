import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonText,IonIcon,IonAvatar,IonGrid,IonRow,IonCol } from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { IArtistWithAlbumsAndSongs } from 'src/app/core/interfaces/artist';
import { ISong } from 'src/app/core/interfaces/song';
import { IAlbum } from 'src/app/core/interfaces/album';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonText,IonIcon,IonAvatar,IonGrid,IonRow,IonCol, CommonModule, FormsModule,GeneralHeaderComponent,TranslateModule]
})
export class ArtistPage implements OnInit {

  private localStore = inject(LocalStorageService);
  private firebaseservice = inject(FirestoreService);
  title : string = "Artist";
  backbutton : string = "back";
  artist = {} as IArtistWithAlbumsAndSongs;
  idArtist : string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if(this.route.snapshot.queryParams && (this.route.snapshot.queryParams as any).id) {
      this.idArtist = (this.route.snapshot.queryParams as any).id;
     
      this.firebaseservice.getArtistWithAlbumsAndSongs(this.idArtist).then(artist => {
        if(artist){
          console.log(artist);
          this.artist = artist;}
      });
    }
  }

}
