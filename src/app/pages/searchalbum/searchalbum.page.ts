import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonList,IonItem,IonLabel } from '@ionic/angular/standalone';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';
import { IAlbum } from 'src/app/core/interfaces/album';
import { EMPTY, Observable, Subscription, combineLatest, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { filterAlbumsByTitle, loadAlbums,loadAlbumsSuccess } from 'src/app/core/store/action/album.action';
import { selectAllAlbums, selectFilteredAlbums } from 'src/app/core/store/selector/album.selector';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-searchalbum',
  templateUrl: './searchalbum.page.html',
  styleUrls: ['./searchalbum.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonList,IonItem,IonLabel, CommonModule, FormsModule,HorizontalCardComponent]
})
export class SearchalbumPage implements OnInit {

  albums$: Observable<IAlbum[]>  = new Observable<IAlbum[]>();
  store = inject(Store<AppState>);
  searchService = inject(SearchService);
  searchSubscription: Subscription|null = null;

  constructor() { }

  ngOnInit() {
    this.store.dispatch(loadAlbums());

    this.albums$ = combineLatest([
      this.searchService.searchQuery$,
      this.store.select(selectAllAlbums),
      this.store.select(selectFilteredAlbums)
    ]).pipe(
      map(([query, allAlbums, filteredAlbums]) => query ? filteredAlbums : allAlbums)
    );
    /*this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.filterAlbums(query);
    });*/
  }

  ngAfterViewInit(): void {
    this.albums$.subscribe((albums) => {
    });
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.filterAlbums(query);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  filterAlbums(query: string) {
    this.store.dispatch(filterAlbumsByTitle({ title:query }));
  }

}
