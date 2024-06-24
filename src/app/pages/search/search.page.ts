import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonLabel,IonIcon, IonHeader, IonTitle, IonToolbar,IonBackButton,IonButtons,IonButton,IonSearchbar,IonList,IonItem,IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack,search,close } from 'ionicons/icons';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { SwitchableButtonsComponent } from 'src/app/shared/switchable-buttons/switchable-buttons.component';
import { IElement } from 'src/app/core/interfaces/element';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';
import { SearchResultComponent } from 'src/app/shared/search-result/search-result.component';
import { TranslateModule } from '@ngx-translate/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButtons,
    IonList,
    IonItem,
    IonText,
    IonButton,
    IonSearchbar,
    IonLabel,
    IonIcon,
    SwitchableButtonsComponent,
    HorizontalCardComponent,
    SearchResultComponent,
    TranslateModule]
})
export class SearchPage implements OnInit {

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  user = {} as IUser;
  buttons : string[] = ["All","Artist","Album","Song"];
  selectedButton: number= 0;
  recentsearchs: IElement[] = [];
  searchResults: any[] = [];
  /*recentsearchs: IElement[] = [
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
      label:'yghj',
    },
    {
      id: 'string',
      type: 'album',
      year: 2024,
      artistName: 'Ange',
      albumName: 'Heritage',
      image:'image',
    }
  ];*/

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
    switch (this.searchType) {
      case 'artist':
        this.selectedButton = 1;
        break;
      case 'album':
        this.selectedButton = 2;
        break;
      case 'song' :
        this.selectedButton = 3;
        break;
      default :
        this.selectedButton = 0;
        break;
    }
    this.search('search', 2, 'song'); // TEMPORARY FOR TESTING
  }


  search(searchText: string, limit: number,  type: string) {
    //  IMPLEMENT SEARCH FUNCTION CORRECTLY (HARD CODED FOR TESTING)
    this.serviceFirestore.searchWithTitle(searchText,limit,type).then(results => {
      this.searchResults = results;
    });
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
