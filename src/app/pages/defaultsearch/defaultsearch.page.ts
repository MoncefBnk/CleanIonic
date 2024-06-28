import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonList,IonText,IonLabel } from '@ionic/angular/standalone';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';
import { SearchResultComponent } from 'src/app/shared/search-result/search-result.component';
import { TranslateModule } from '@ngx-translate/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { addIcons } from 'ionicons';
import { IUser } from 'src/app/core/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { IElement } from 'src/app/core/interfaces/element';
import { arrowBack,search,close } from 'ionicons/icons';

@Component({
  selector: 'app-defaultsearch',
  templateUrl: './defaultsearch.page.html',
  styleUrls: ['./defaultsearch.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonItem,
    IonList,
    IonText,
    IonLabel,
    IonToolbar,
    CommonModule,
    FormsModule,
    HorizontalCardComponent,
    SearchResultComponent,
    TranslateModule]
})
export class DefaultsearchPage implements OnInit {

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  user = {} as IUser;
  buttons : string[] = ["All","Artist","Album","Song"];
  selectedButton: number= 0;
  recentsearchs: IElement[] = [];
  mostsearchs: IElement[] = [
    {
      id: 'string',
      songtitle: 'Song1',
      type: 'song',
      albumName: 'Heritage',
      artistName: 'Ange',
      image:'image',
    },
    {
      id: 'string',
      songtitle: 'Song1',
      type: 'artist',
      nbrAlbum: 3,
      artistName: 'Ange',
      image:'image',
    },
    {
      id: 'string',
      type: 'album',
      year: 2024,
      artistName: 'Ange',
      albumName: 'Heritage',
      image:'image',
    }
  ];
  searchType: string|null ="";
  searchId: string|null="";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    addIcons({ search,arrowBack,close });
    this.getUser();


    this.serviceFirestore.getRecentSearched(this.user.id,5).then(recents => {
      if(recents)
        this.recentsearchs = recents;
    });

    this.searchType = this.route.snapshot.paramMap.get('type');
    this.searchId = this.route.snapshot.paramMap.get('id');
    console.log(this.searchType,this.searchId)

  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }

  toggleButton(index: number) {
    this.selectedButton = this.selectedButton === index ? 0 : index;
  }
  removeAll() {

  }

}
