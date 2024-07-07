import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList,IonButton,IonIcon } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ISongWithDetails } from 'src/app/core/interfaces/song';
import { HorizontalCardItemComponent } from 'src/app/shared/card/horizontal-card-item/horizontal-card-item.component';
import { playCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MusicService } from 'src/app/core/services/music.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-musicplaylist',
  templateUrl: './musicplaylist.page.html',
  styleUrls: ['./musicplaylist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList,IonButton,IonIcon, CommonModule, FormsModule,GeneralHeaderComponent,HorizontalCardItemComponent]
})
export class MusicplaylistPage implements OnInit {

  backbutton : string = "back";
  end_icon : string = "ellipsis-horizontal";
  title : string = "Playlist Music";
  user = {} as IUser;
  songs : ISongWithDetails[]=[];
  playlistId : string ='';

  private userService = inject(UserService);
  private musicservice = inject(MusicService);
  private localStore = inject(LocalStorageService);

  constructor(private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    addIcons({ playCircle });
    this.getUser();
    if(this.route.snapshot.queryParams && (this.route.snapshot.queryParams as any).id) {
      this.playlistId = (this.route.snapshot.queryParams as any).id;
     
      this.userService.getPlaylistMusic(this.user.id,this.playlistId,10).then(songs => {
        if(songs)
          this.songs = songs;
      });
    }
    
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }

  
  onplayAll() {
    this.musicservice.playAll(this.songs);
  }

  ngOnDestroy() {
    console.log('music playlist destroyed');
  }

}
