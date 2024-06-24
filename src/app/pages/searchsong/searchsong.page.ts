import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList } from '@ionic/angular/standalone';
import { ISong } from 'src/app/core/interfaces/song';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { AppState } from 'src/app/core/store/app.state';
import { SearchService } from 'src/app/core/services/search.service';
import { Store } from '@ngrx/store';
import { filterSongsByTitle, loadSongs } from 'src/app/core/store/action/song.action';
import { selectAllSongs, selectFilteredSongs } from 'src/app/core/store/selector/song.selector';
import { HorizontalCardComponent } from 'src/app/shared/horizontal-card/horizontal-card.component';

@Component({
  selector: 'app-searchsong',
  templateUrl: './searchsong.page.html',
  styleUrls: ['./searchsong.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonLabel,IonList , CommonModule, FormsModule,HorizontalCardComponent]
})
export class SearchsongPage implements OnInit {

  songs$: Observable<ISong[]>  = new Observable<ISong[]>();
  store = inject(Store<AppState>);
  searchService = inject(SearchService);
  searchSubscription: Subscription|null = null;

  constructor() { }

  ngOnInit() {
    this.store.dispatch(loadSongs());

    this.songs$ = combineLatest([
      this.searchService.searchQuery$,
      this.store.select(selectAllSongs),
      this.store.select(selectFilteredSongs)
    ]).pipe(
      map(([query, allSongs, filteredSongs]) => query ? filteredSongs : allSongs)
    );
  }

  ngAfterViewInit(): void {
    this.songs$.subscribe((songs) => {
    });
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.filterSongs(query);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  filterSongs(query: string) {
    this.store.dispatch(filterSongsByTitle({ title:query }));
  }

}
