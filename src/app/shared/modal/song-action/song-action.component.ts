import { Component, Input, OnInit, inject } from '@angular/core';
import { IonContent,IonList,IonIcon,IonItem,IonLabel } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { personOutline,musicalNoteOutline,addCircleOutline } from 'ionicons/icons';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MusicService } from 'src/app/core/services/music.service';
import { ISongWithDetails } from 'src/app/core/interfaces/song';
import { SongService } from 'src/app/core/services/song.service';

@Component({
  selector: 'app-song-action',
  templateUrl: './song-action.component.html',
  styleUrls: ['./song-action.component.scss'],
  standalone:true,
  imports: [IonContent,IonList,IonIcon,IonItem,IonLabel,TranslateModule]
})
export class SongActionComponent  implements OnInit {

  private songService = inject(SongService);
  private musicservice = inject(MusicService);

  @Input() songId : string = '';
  @Input() artistId : string = '';
  @Input() playlistId : string = '';
  @Input() dismissModal: () => void = () => {};
  song = {} as ISongWithDetails;
  

  constructor(private router: Router,private loadingController: LoadingController) { }

  ngOnInit() {
    addIcons({ personOutline,musicalNoteOutline,addCircleOutline });
  }

  async navigateArtist(id:string) {
    this.dismissModal();
    console.log(id);
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 7000
    });

    await loading.present();
    this.router.navigate(['artist'], { queryParams: {id:id}});
    loading.dismiss();
  }

  async onaddToQueue(id:string) {
    this.dismissModal();
    console.log(id);
    await this.songService.getOneSong(id).then(music => {
      if(music)
        this.song = music;
    });
    this.musicservice.addToQueue(this.song);
  }

}
