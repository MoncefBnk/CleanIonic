import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonButton, IonSearchbar, IonList, IonItem, IonText, IonLabel } from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, search, close } from 'ionicons/icons';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IUser } from 'src/app/core/interfaces/user';
import { IElement } from 'src/app/core/interfaces/element';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { SearchService } from 'src/app/core/services/search.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonLabel, HorizontalCardComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, TranslateModule, FormsModule, IonBackButton, IonButtons, IonButton, IonSearchbar, IonList, IonItem, IonText, RouterModule]
})
export class SearchPage implements OnInit,OnDestroy {
  private router = inject(ActivatedRoute);

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);

  user = {} as IUser;
  buttons: string[] = ["All", "Artist", "Album", "Song"];
  selectedButton: number = 0;
  recentsearchs: IElement[] = [];
  searchFilter: string = "";
  searchResults: any[] = [];
  searchFilters: string[] = ["All", "Artist", "Album", "Song"];
  mostsearchs: IElement[] = [
    {
      id: 'string',
      songtitle: 'Song1',
      type: 'song',
      albumName: 'Heritage',
      artistName: 'Ange',
      image: 'image',
    },
    {
      id: 'string',
      songtitle: 'Song1',
      type: 'artist',
      nbrAlbum: 3,
      artistName: 'Ange',
      image: 'image',
    },
    {
      id: 'string',
      type: 'album',
      year: 2024,
      artistName: 'Ange',
      albumName: 'Heritage',
      image: 'image',
    }
  ];
  searchType = "";
  query: string = '';

  constructor(private route: ActivatedRoute) { }

  store = inject(Store<AppState>);
  searchService = inject(SearchService);

  ngOnInit() {
    addIcons({ search, arrowBack });
    this.getUser();
    this.searchType = this.buttons[this.selectedButton];
    this.resolveSearchFilter();
    this.search('A', 10, 'all'); // TEMPORARY FOR TESTING
  }

  onSearchChange(event: any) {
    const query = event.target.value;
    this.query = query;
    this.search(query, 10, this.searchFilter);
  }

  search(searchText: string, limit: number, type: string) {
    this.serviceFirestore.searchWithTitle(searchText, limit, type).then(results => {
      this.searchResults = results;
      console.log(this.searchResults);
    });
  }

  resolveSearchFilter() {
    switch (this.selectedButton) {
      case 1:
        this.searchFilter = "artist";
        break;
      case 2:
        this.searchFilter = "album";
        break;
      case 3:
        this.searchFilter = "song";
        break;
      default:
        this.searchFilter = "all";
        break;
    }
  }

  ngOnDestroy() {
    console.log('search ');
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser> = this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if (userdata) {
      this.user = userdata;
    }
  }

  toggleButton(index: number) {
    this.selectedButton = this.selectedButton === index ? 0 : index;
    this.resolveSearchFilter();
    this.search(this.query, 10, this.searchFilter);
  }

  removeAll() {
    this.recentsearchs = [];
  }

}
