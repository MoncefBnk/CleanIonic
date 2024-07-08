import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { and, collection, doc, endAt, getDoc, getDocs, getFirestore, increment, limit, or, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';
import { Observable, catchError, forkJoin, from, map, of, switchMap } from 'rxjs';
import { ISong, ISongWithDetails } from '../interfaces/song';
import { AlbumService } from './album.service';
import { ArtistService } from './artist.service';
import { IArtist, IArtistWithAlbumsAndSongs } from '../interfaces/artist';


@Injectable({
  providedIn: 'root'
})
export class SongService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private albumservice = inject(AlbumService);
  private artistservice = inject(ArtistService);
  constructor() { }

  async getSongsWithDetails(artistId: string): Promise<ISongWithDetails[]> {
    try {
      const songsCol = collection(this.db, 'song');
      const q = query(songsCol, where('artistId', '==', artistId));
      const songsSnapshot = await getDocs(q);

      return Promise.all(songsSnapshot.docs.map(async doc => {
        const songData = doc.data() as ISong;
        const album = await this.albumservice.getOneAlbum(songData.albumId);
        const artist = await this.artistservice.getOneArtist(artistId);

        return {
          id: doc.id,
          title: songData['title'],
          duration: songData['duration'],
          cover: songData['cover'],
          fileUrl: songData['fileUrl'],
          artistId: songData['artistId'],
          albumId: songData['albumId'],
          createdAt: songData['createdAt'],
          updatedAt: songData['updatedAt'],
          searchScore: songData['searchScore'],
          lyrics: songData['lyrics'],
          lastUpdatedSearchScore: songData['lastUpdatedSearchScore'],
          artist: artist,
          album: album
        } as ISongWithDetails;
      }));
    } catch (error) {
      console.error('Error fetching songs with details', error);
      throw error;
    }
  }

  async updateSongScore(id:string) : Promise<void> {
    const songRef = doc(this.db, 'song',id);
    try {
      updateDoc(songRef,{searchScore: increment(1)})
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async  getTopSongs(limitCount: number): Promise<ISong[]> {
    const songsRef = collection(this.db, 'song');
    const q = query(songsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const songSnapshot = await getDocs(q);

    const topSongs: ISong[] = [];
    songSnapshot.forEach((doc) => {
    const data = doc.data();
      topSongs.push({
        id: doc.id,
        title: data['title'],
        duration: data['duration'],
        cover: data['cover'],
        fileUrl: data['fileUrl'],
        artistId: data['artistId'],
        albumId: data['albumId'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
      });
    });

    return topSongs;
  }

  async getTopSongsWithDetails(limitCount: number): Promise<ISongWithDetails[]> {
    const songsRef = collection(this.db, 'song');
    const q = query(songsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const songSnapshot = await getDocs(q);

    const songs: ISongWithDetails[] = [];

    for (const doc of songSnapshot.docs) {
      const data = doc.data();
      const song: ISong = {
        id: doc.id,
        title: data['title'],
        duration: data['duration'],
        cover: data['cover'],
        fileUrl: data['fileUrl'],
        artistId: data['artistId'],
        albumId: data['albumId'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
        lyrics: data['lyrics'],
      };

      const artist = await this.artistservice.getOneArtist(song.artistId);
      const album = await this.albumservice.getOneAlbum(song.albumId);

      if (artist && album) {
        songs.push({ ...song, artist, album });
      }
    }
    return songs;
  }

  async getOneSong(id:string): Promise<ISongWithDetails | null> {
    const q = doc(this.db, 'song',id);
    const songSnapshot = await getDoc(q);
    if (songSnapshot.exists()) {
      const data = songSnapshot.data();
      const artist = await this.artistservice.getOneArtist(data['artistId']);
      const album = await this.albumservice.getOneAlbum(data['albumId']);

      if(artist && album) {console.log(data);
        const song: ISongWithDetails = {
          id: songSnapshot.id,
          title: data['title'],
          duration: data['duration'],
          cover: data['cover'],
          fileUrl: data['fileUrl'],
          artistId: data['artistId'],
          albumId: data['albumId'],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          searchScore: data['searchScore'],
          lyrics: data['lyrics'],
          lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
          artist,
          album

        };
        return song;
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

  private async searchSongs(searchTerm: string | null, limitCount: number): Promise<ISongWithDetails[]> {
    const collectionRef = collection(this.db, 'song');
    let q;

    if (searchTerm && searchTerm.trim() !== '') {
      const start = searchTerm;
      const end = searchTerm + '\uf8ff';
      q = query(collectionRef, orderBy('title'), startAt(start), endAt(end), limit(limitCount));
    } else {
      q = query(collectionRef, orderBy('title'), limit(limitCount));
    }

    const songSnapshot = await getDocs(q);
    const songs: ISongWithDetails[] = [];

    for (const doc of songSnapshot.docs) {
      const data = doc.data();
      const song: ISong = {
        id: doc.id,
        title: data['title'],
        duration: data['duration'],
        cover: data['cover'],
        fileUrl: data['fileUrl'],
        artistId: data['artistId'],
        albumId: data['albumId'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
      };

      const artist = await this.artistservice.getOneArtist(song.artistId);
      const album = await this.albumservice.getOneAlbum(song.albumId);

      if (artist && album) {
        songs.push({ ...song, artist, album });
      }
    }

    return songs;
  }

  getOneSongObservable(id:string): Observable<ISongWithDetails | null> {
    const songDocRef = doc(this.db, 'song', id);
    return from(getDoc(songDocRef)).pipe(
      switchMap(songSnapshot => {
        if (songSnapshot.exists()) {
          const data = songSnapshot.data();
          return this.artistservice.getOneArtistObservable(data['artistId']).pipe(
            switchMap(artist => this.albumservice.getOneAlbumObservable(data['albumId']).pipe(
              map(album => {
                if (artist && album) {
                  const song: ISongWithDetails = {
                    id: songSnapshot.id,
                    title: data['title'],
                    duration: data['duration'],
                    cover: data['cover'],
                    fileUrl: data['fileUrl'],
                    artistId: data['artistId'],
                    albumId: data['albumId'],
                    createdAt: data['createdAt'].toDate(),
                    updatedAt: data['updatedAt'].toDate(),
                    searchScore: data['searchScore'],
                    lyrics: data['lyrics'],
                    lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
                    artist,
                    album
                  };
                  return song;
                } else {
                  console.log('No such album!');
                  return null;
                }
              })
            ))
          );
        } else {
          console.log('No such album!');
          return of(null);
        }
      })
    );

  }

  getAllSongsWithDetails(): Observable<ISongWithDetails[]> {
    const songsCol = collection(this.db, 'song');

    return from(getDocs(songsCol)).pipe(
      switchMap(snapshot => {
        const songObservables: Observable<ISongWithDetails | null>[] = snapshot.docs.map(doc => {
          const songData = doc.data();
          const artistId = songData['artistId'];
          const albumId = songData['albumId'];

          return this.artistservice.getOneArtistObservable(artistId).pipe(
            switchMap(artist => this.albumservice.getOneAlbumObservable(albumId).pipe(
              map(album => {
                if (artist && album) {
                  return {
                    id: doc.id,
                    title: songData['title'],
                    duration: songData['duration'],
                    cover: songData['cover'],
                    fileUrl: songData['fileUrl'],
                    artistId: songData['artistId'],
                    albumId: songData['albumId'],
                    createdAt: songData['createdAt'].toDate(),
                    updatedAt: songData['updatedAt'].toDate(),
                    searchScore: songData['searchScore'],
                    lyrics: songData['lyrics'],
                    lastUpdatedSearchScore: songData['lastUpdatedSearchScore'].toDate(),
                    artist,
                    album
                  } as ISongWithDetails;
                } else {
                  console.log('No such album or artist!');
                  return null;
                }
              }),
              catchError(err => {
                console.error(`Error fetching album for song ${doc.id}`, err);
                return of(null);
              })
            )),
            catchError(err => {
              console.error(`Error fetching artist for song ${doc.id}`, err);
              return of(null);
            })
          );
        });

        return forkJoin(songObservables);
      }),
      map(results => results.filter(result => result !== null) as ISongWithDetails[]),
      catchError(err => {
        console.error('Error fetching songs', err);
        return of([] as ISongWithDetails[]);
      })
    );
  }

  async getArtistWithAlbumsAndSongs(artistId: string): Promise<IArtistWithAlbumsAndSongs | null> {
    try {
      const artistDocRef = doc(this.db, 'artist', artistId);
      const artistSnapshot = await getDoc(artistDocRef);

      if (!artistSnapshot.exists()) {
        console.log('No such artist!');
        return null;
      }

      const artistData = artistSnapshot.data() as IArtist;
      const albums = await this.albumservice.getAlbumsWithDetails(artistId);
      const songs = await this.getSongsWithDetails(artistId);
      console.log(songs);

      const artistWithAlbumsAndSongs: IArtistWithAlbumsAndSongs = {
        ...artistData,
        albumsDetail: albums,
        songs: songs
      };

      return artistWithAlbumsAndSongs;
    } catch (error) {
      console.error('Error fetching artist with albums and songs', error);
      throw error; // Propagate the error
    }
  }
}
