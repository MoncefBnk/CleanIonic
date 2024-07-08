import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { and, collection, doc, endAt, getDoc, getDocs, getFirestore, increment, limit, or, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';
import { IAlbum, IAlbumsWithDetails } from '../interfaces/album';
import { Observable, catchError, forkJoin, from, map, of, switchMap } from 'rxjs';
import { ArtistService } from './artist.service';
import { IArtist, IArtistWithAlbumsAndSongs } from '../interfaces/artist';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private artistservice = inject(ArtistService);
  constructor() { }

  //update album score
  async updateAlbumScore(id:string) : Promise<void> {
    const albumRef = doc(this.db, 'album',id);
    try {
      updateDoc(albumRef,{searchScore: increment(1)})
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  //Get latest album
  async getLatestAlbum() : Promise<IAlbum | null> {
    const albumsCol = collection(this.db, 'album');
    const q = query(albumsCol, orderBy('createdAt', 'desc'), limit(1));
    const albumSnapshot = await getDocs(q);
    if (!albumSnapshot.empty) {
      const doc = albumSnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        title: data['title'],
        cover: data['cover'],
        artistId: data['artistId'],
        releaseDate: data['releaseDate'].toDate(),
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
        category: data['category'],
        year: data['year'],
        song: data['song'],
      };
    } else {
      console.log('No such album!');
      return null;
    }
  }

  async getOneAlbum(id:string) : Promise<IAlbumsWithDetails | null> {
    const q = doc(this.db, 'album',id);
    const albumSnapshot = await getDoc(q);

    if (albumSnapshot.exists()) {
      const data = albumSnapshot.data();
      const artist = await this.artistservice.getOneArtist(data['artistId']);

      if(artist) {
        const album: IAlbumsWithDetails = {
          id: albumSnapshot.id,
          title: data['title'],
          cover: data['cover'],
          artistId: data['artistId'],
          releaseDate: data['releaseDate'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          searchScore: data['searchScore'],
          lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
          category: data['category'],
          year: data['year'],
          song: data['song'],
          artist,

        };

        return album;
      }
      else {
        console.log('No such album!');
        return null;
      }
    }
    else {
      console.log('No such album!');
      return null;
    }
  }

  //Get top album
  async  getTopAlbums(limitCount: number) : Promise<IAlbumsWithDetails[] | null>{
    const albumsRef = collection(this.db, 'album');
    const q = query(albumsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const albumSnapshot = await getDocs(q);

    if (!albumSnapshot.empty) {
      const albums: IAlbumsWithDetails[] = [];

      for (const doc of albumSnapshot.docs) {
        const data = doc.data();

        const artist = await this.artistservice.getOneArtist(data['artistId']);

        if(artist) {
          const album = {
            id: doc.id,
            title: data['title'],
            cover: data['cover'],
            artistId: data['artistId'],
            releaseDate: data['releaseDate'].toDate(),
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
            searchScore: data['searchScore'],
            lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
            category: data['category'],
            year: data['year'],
            song: data['song'],
          }
          albums.push({...album,artist});
        }
      }

      return albums;

    } else {
      return null;
    }

  }

  //search album
  async getSearchAlbum(name: string, search: string): Promise<IAlbum[] | null> {
    const searchCollection = collection(this.db, name);
    const searchQuery = query(
      searchCollection,
      and(
        or(
          where('title', '>=', search.trim()), // Filtre pour les noms qui commencent par la valeur de recherche
          where('title', '<=', search.trim() + '\uf8ff'),
          where('year', '==', search),
          where('category', '==', search)
        )
      )
    );

    const albumsSnapshot = await getDocs(searchQuery);
    if (!albumsSnapshot.empty) {
      const albums: IAlbum[] = [];

      for (const doc of albumsSnapshot.docs) {
        const data = doc.data();
        const album = {
          id: doc.id,
          title: data['title'],
          cover: data['cover'],
          artistId: data['artistId'],
          releaseDate: data['releaseDate'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          searchScore: data['searchScore'],
          lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
          category: data['category'],
          year: data['year'],
          song: data['song'],
        }
        albums.push(album);
      }

      return albums;

    } else {
      return null;
    }
  }

  //
  async getAlbums2() {
    const albumsCol = collection(this.db, 'albums');
    const q = query(albumsCol, where('artist.name', '==', 'Mike'), limit(3));
    const albumsSnapshot = await getDocs(q);
    const albumsList = albumsSnapshot.docs.map((doc) => doc.data());
    return albumsList;
  }

  async getAlbumsWithDetails(artistId: string): Promise<IAlbumsWithDetails[]> {
    try {
      const albumsCol = collection(this.db, 'album');
      const q = query(albumsCol, where('artistId', '==', artistId));
      const albumsSnapshot = await getDocs(q);

    return Promise.all(albumsSnapshot.docs.map(async doc => {
      const albumData = doc.data() as IAlbum;
      const artist = await this.artistservice.getOneArtist(artistId);

      return {
        id: doc.id,
        title: albumData['title'],
        cover: albumData['cover'],
        artistId: albumData['artistId'],
        releaseDate: albumData['releaseDate'],
        createdAt: albumData['createdAt'],
        updatedAt: albumData['updatedAt'],
        searchScore: albumData['searchScore'],
        lastUpdatedSearchScore: albumData['lastUpdatedSearchScore'],
        category: albumData['category'],
        year: albumData['year'],
        song: albumData['song'],
        artist
      } as IAlbumsWithDetails;
    }));
  } catch (error) {
    console.error('Error fetching albums with details', error);
    throw error;
  }
  }

  private async searchAlbums(searchTerm: string | null, limitCount: number): Promise<IAlbum[]> {
    const collectionRef = collection(this.db, 'album');
    let q;

    if (searchTerm && searchTerm.trim() !== '') {
      const start = searchTerm;
      const end = searchTerm + '\uf8ff';
      q = query(collectionRef, orderBy('title'), startAt(start), endAt(end), limit(limitCount));
    } else {
      q = query(collectionRef, orderBy('title'), limit(limitCount));
    }

    const albumSnapshot = await getDocs(q);
    const albums: IAlbum[] = [];

    for (const doc of albumSnapshot.docs) {
      const data = doc.data();
      const artist = await this.artistservice.getOneArtist(data['artistId']);

      if (artist) {
        const album = {
          id: doc.id,
          title: data['title'],
          cover: data['cover'],
          artistId: data['artistId'],
          releaseDate: data['releaseDate'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          searchScore: data['searchScore'],
          lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
          category: data['category'],
          year: data['year'],
          song: data['song'],
          artist,
        };

        albums.push(album);
      }
    }

    return albums;
  }

  getOneAlbumObservable(id:string) : Observable<IAlbumsWithDetails | null> {
    const albumDocRef = doc(this.db, 'album', id);
    return from(getDoc(albumDocRef)).pipe(
      switchMap(albumSnapshot => {
        if (albumSnapshot.exists()) {
          const data = albumSnapshot.data();
          return this.artistservice.getOneArtistObservable(data['artistId']).pipe(
            map(artist => {
              if (artist) {
                return {
                  id: albumSnapshot.id,
                  title: data['title'],
                  cover: data['cover'],
                  artistId: data['artistId'],
                  releaseDate: data['releaseDate'].toDate(),
                  createdAt: data['createdAt'].toDate(),
                  updatedAt: data['updatedAt'].toDate(),
                  searchScore: data['searchScore'],
                  lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
                  category: data['category'],
                  year: data['year'],
                  song: data['song'],
                  artist
                } as IAlbumsWithDetails;
              } else {
                console.log('No such artist!');
                return null;
              }
            })
          );
        } else {
          console.log('No such album!');
          return of(null);
        }
      })
    );

  }

  getAlbums(): Observable<IAlbumsWithDetails[]> {
    const albumsCol = collection(this.db, 'album');

    return from(getDocs(albumsCol)).pipe(
      switchMap(snapshot => {
        const albumObservables: Observable<IAlbumsWithDetails>[] = snapshot.docs.map(doc => {
          const albumData = doc.data() as IAlbum;
          const artistId = albumData.artistId;

          return from(this.artistservice.getOneArtist(artistId)).pipe(
            map(artist => ({
              id: doc.id,
              title: albumData.title,
              artistId: albumData.artistId,
              releaseDate: albumData.releaseDate,
              cover: albumData.cover,
              searchScore: albumData.searchScore,
              category: albumData.category,
              year: albumData.year,
              song: albumData.song,
              artist: artist // Include artist details in album
            } as IAlbumsWithDetails)),
            catchError(err => {
              console.error(`Error fetching artist for album ${doc.id}`, err);
              return of({} as IAlbumsWithDetails);
            })
          );
        });

        return forkJoin(albumObservables);
      }),
      catchError(err => {
        console.error('Error fetching albums', err);
        return of([] as IAlbumsWithDetails[]); // Handle error by returning empty array
      })
    );
  }
}
