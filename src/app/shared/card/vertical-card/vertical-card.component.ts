import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IAlbum } from 'src/app/core/interfaces/album';
import { ISong, ISongWithDetails } from 'src/app/core/interfaces/song';
import { IonText,IonItem,IonList,IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IArtist } from 'src/app/core/interfaces/artist';
import { IPlaylist } from 'src/app/core/interfaces/user';
import { NavController,ModalController,LoadingController } from '@ionic/angular';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';



@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    CommonModule,
  ]
})
export class VerticalCardComponent  implements OnInit {

  @Input() albums: IAlbum[] = [];
  @Input() songs: ISongWithDetails[] = [];
  @Input() artists: IArtist[] =[];
  @Output() songClick = new EventEmitter<ISongWithDetails>();
  song = {} as ISongWithDetails;


  private serviceFirestore = inject(FirestoreService);
  smallPlayerVisible = false;

  constructor(private router: Router, private modalController: ModalController, private loadingController: LoadingController) { 
      
  }

  ngOnInit() {}

  async onSongClick(song: ISongWithDetails) {
    this.songClick.emit(song);
  }

  async navigatetoArtist(id:string) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 7000
    });

    await loading.present();
    this.router.navigate(['artist'], { queryParams: {id:id}});
    loading.dismiss();
  }

}
