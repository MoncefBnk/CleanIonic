import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonText,IonIcon,IonAvatar,IonGrid,IonRow,IonCol,IonSegment,IonSegmentButton,IonLabel,IonList } from '@ionic/angular/standalone';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IArtistWithAlbumsAndSongs } from 'src/app/core/interfaces/artist';
import { ISong } from 'src/app/core/interfaces/song';
import { IAlbum } from 'src/app/core/interfaces/album';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HorizontalCardItemComponent } from 'src/app/shared/card/horizontal-card-item/horizontal-card-item.component';
import { ArtistService } from 'src/app/core/services/artist.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonText,IonIcon,IonAvatar,IonGrid,IonRow,IonCol,IonSegment,IonSegmentButton,IonLabel,IonList, CommonModule, FormsModule,GeneralHeaderComponent,TranslateModule,HorizontalCardItemComponent]
})
export class ArtistPage implements OnInit {

  private localStore = inject(LocalStorageService);
  private artistService = inject(ArtistService);

  title : string = "Artist";
  backbutton : string = "back";
  artist = {} as IArtistWithAlbumsAndSongs;
  idArtist : string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if(this.route.snapshot.queryParams && (this.route.snapshot.queryParams as any).id) {
      this.idArtist = (this.route.snapshot.queryParams as any).id;
     
      this.artistService.getArtistWithAlbumsAndSongs(this.idArtist).then(artist => {
        if(artist){
          console.log(artist);
          this.artist = artist;}
      });
    }
  }

  segmentChanged(ev: any) {

  }

}
