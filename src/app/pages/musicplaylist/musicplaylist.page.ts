import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ISongWithDetails } from 'src/app/core/interfaces/song';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';

@Component({
  selector: 'app-musicplaylist',
  templateUrl: './musicplaylist.page.html',
  styleUrls: ['./musicplaylist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList, CommonModule, FormsModule,GeneralHeaderComponent,HorizontalCardComponent]
})
export class MusicplaylistPage implements OnInit {

  backbutton : string = "back";
  end_icon : string = "ellipsis-horizontal";
  title : string = "Playlist Music";
  user = {} as IUser;
  songs : ISongWithDetails[]=[];
  playlistId : string ='';

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  constructor(private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {

    this.getUser();
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation);
    if(navigation && navigation.extras.queryParams  && (navigation.extras.queryParams as any).id) {
      this.playlistId = (navigation.extras.queryParams as any).id;
     
      this.serviceFirestore.getPlaylistMusic(this.user.id,this.playlistId,10).then(songs => {
        if(songs)
          this.songs = songs;
        console.log(this.songs);
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

}
