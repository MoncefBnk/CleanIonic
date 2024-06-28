import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonBackButton,IonButtons,IonButton,IonSearchbar,IonList,IonItem,IonText } from '@ionic/angular/standalone';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack,search,close } from 'ionicons/icons';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IUser } from 'src/app/core/interfaces/user';
import { IElement } from 'src/app/core/interfaces/element';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { filterAlbumsByTitle } from 'src/app/core/store/action/album.action';
import { SearchService } from 'src/app/core/services/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButtons,IonButton,IonSearchbar,IonList,IonItem,IonText,RouterModule]
})
export class SearchPage implements OnInit {
  private router = inject(ActivatedRoute);

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

  query : string = '';
  constructor(private route: Router) { }
  store = inject(Store<AppState>);
  searchService = inject(SearchService);

  ngOnInit() {
    addIcons({ search,arrowBack });
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrl(event.urlAfterRedirects);
      }
    });
    /*this.searchType = this.route.snapshot.paramMap.get('type');
    this.searchId = this.route.snapshot.paramMap.get('id');*/
  }


  onSearchChange(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  checkUrl(url: string) {
    if(url.includes('search/artist'))
      this.selectedButton = 1;
    else if(url.includes('search/album'))
      this.selectedButton = 2;
    else if(url.includes('search/song'))
      this.selectedButton = 3;
    else
      this.selectedButton = 0;
  }

  toggleButton(index: number) {
    this.selectedButton = this.selectedButton === index ? 0 : index;
    switch (this.selectedButton) {
      case 1:
        this.route.navigate(['search/artist']);
      break;
      case 2:
        this.route.navigate(['search/album']);
      break;
      case 3:
        this.route.navigate(['search/song']);
      break;
      default:
        this.route.navigate(['search/default']);
        break;
    }
  }

}
