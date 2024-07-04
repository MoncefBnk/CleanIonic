import { search } from 'ionicons/icons';
import { Injectable, inject } from '@angular/core';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  limit,
  query,
  where,
  and,
  or,
  orderBy,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  startAt,
  endAt
} from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';
import { ISong, ISongWithDetails } from '../interfaces/song';
import { IAlbum, IAlbumsWithDetails } from '../interfaces/album';
import { ERole, ILastPlayed, ILastPlayedWithDetails, IPlaylist, IUser } from '../interfaces/user';
import { IArtist, IArtistWithDetails } from '../interfaces/artist';
import { RequestResponse } from '../interfaces/response';
import { IElement } from '../interfaces/element';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';



@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private apiservice = inject(ApiService);

  constructor() {}

  /** Start User */
  async createUser(id: string,email: string, password: string , phoneNumber: string , firstName: string , lastName: string,dateBirth:Date,isArtist:boolean,followers:number,isEmailVerified:boolean,role:ERole) {
    const userRef = doc(this.db, 'user',id);
    const data = { email: email,password: password, phoneNumber: phoneNumber , firstName: firstName , lastName: lastName,isArtist:isArtist,followers:followers,isEmailVerified:isEmailVerified,role:role,createdAt: new Date(),updatedAt: new Date(),isActive:true};
    return await setDoc(userRef,data);
  }

  async getUser(id: string) : Promise<IUser | null> {
    const userRef = doc(this.db, 'user',id);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      return {
        id: userSnapshot.id,
        firstname: data['firstName'],
        lastname: data['lastName'],
        email: data['email'],
        role: data['role'],
        isEmailVerified: data['isEmailVerified'],
        dateBirth: new Date(data['dateBirth']),
        phoneNumber: data['phoneNumber'],
        followers: data['followers'],
        isArtist: data['isArtist'],
        createdAt: new Date(data['createdAt']),
        updatedAt: new Date(data['updatedAt']),
      } as IUser;
    }
    else {
      // Handle the case where the document does not exist
      console.log(`No such user with id ${id}!`);
      return null;
    }
  }

  async getRecentSearched(id:string,limitCount:number): Promise<IElement[] |null> {
    const historySongRef = collection(this.db, 'user/'+id+'/searchHistory');
    const q = query(historySongRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const recentSearchedSnapshot = await getDocs(q);
    if (!recentSearchedSnapshot.empty) {
      const elements: IElement[] = [];
      for (const doc of recentSearchedSnapshot.docs) {
        const data = doc.data();
        switch(data['type']) {
          case 'artist': {
              const artist = await this.getOneArtist(data['id']);
              if(artist) {
                const elt = {
                  id: doc.id,
                  type: 'artist',
                  artistName: data['artist'],
                  nbrAlbum : data['albums']?data['albums'].length : 0,
                  image:data['cover'],
                }
                elements.push({...elt});
              }
              break;
          }
          case 'album': {
              const album = await this.getOneAlbum(data['id']);
              if(album) {
                const elt = {
                  id: doc.id,
                  type: 'album',
                  albumName: album['title'],
                  artistName: album['artist']['artist'],
                  year: album['year'] ,
                  image:album['cover'],
                }
                elements.push({...elt});
              }
              break;
          }
          case 'song': {
              const song = await this.getOneSong(data['id']);
              if(song) {
                const elt = {
                  id: doc.id,
                  type: 'song',
                  songtitle: song['title'],
                 // artistName: data['artist']['artist'],
                  image:song['cover'],
                }
                elements.push({...elt});
              }
              break;
          }
          default: {
            const artist = await this.getOneArtist(data['id']);
            const album = await this.getOneAlbum(data['id']);
            const song = await this.getOneSong(data['id']);

            if (artist) {
              const artistElt = {
                id: doc.id,
                type: 'artist',
                artistName: artist['artist'],
                nbrAlbum: artist['albums'] ? artist['albums'].length : 0,
                image: data['cover'],
              };
              elements.push({ ...artistElt });
            }

            if (album) {
              const albumElt = {
                id: doc.id,
                type: 'album',
                albumName: album['title'],
                artistName: album['artist']['artist'],
                year: album['year'],
                image: album['cover'],
              };
              elements.push({ ...albumElt });
            }

            if (song) {
              const songElt = {
                id: doc.id,
                type: 'song',
                songTitle: song['title'],
                // artistName: data['artist']['artist'],
                image: song['cover'],
              };
              elements.push({ ...songElt });
            }

            break;
          }
        }
      }
      return elements;
    } else
      return null;
  }

  async deleteUser(id:string) : Promise<void> {
    const userRef = doc(this.db, 'user',id);
    try {
      updateDoc(userRef,{isActive: false})
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /** fin user */

  /** start album */

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
      const artist = await this.getOneArtist(data['artistId']);

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

        const artist = await this.getOneArtist(data['artistId']);

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

  // Get all albums
    getAlbums(): Observable<IAlbum[]> {
    const albumsCol = collection(this.db, 'album');

    const albumsSnapshot = from(getDocs(albumsCol));

    return albumsSnapshot.pipe(
      map(
        (snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as IAlbum[]
      )
    );
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

  /** end album */

  /** start artist */

  async createArtist(userId:string,artistName:string,label:string,description:string,avatar:string) : Promise<RequestResponse>{
    try {
    const data = { userId: userId,artist: artistName, label: label , description: description , avatar: avatar,followers:0,searchScore:0,lastUpdatedSearchScore: new Date(),createdAt: new Date(),updatedAt: new Date()};
    const result = await addDoc(collection(this.db, "artist"), data);
    if (result) {
      const userRef = doc(this.db, 'user',userId);
      updateDoc(userRef,{isArtist: true});
    }
    return {
      code: 201,
      error: false,
      message : "Artist account created successfully!"
    } as RequestResponse;
  } catch (error) {
    console.log(error);
    return {
      code: 401,
      error: true,
      message: "Something went wrong, please try again later!",
    } as RequestResponse;
  }
  }

  async  getTopArtists(limitCount: number): Promise<IArtist[] | null> {
    const artistsRef = collection(this.db, 'artist');
    const q = query(artistsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const artistSnapshot = await getDocs(q);
    if (!artistSnapshot.empty) {
      const topArtists: IArtist[] = [];

      for (const doc of artistSnapshot.docs) {
        const data = doc.data();
        const artist = {
          id: doc.id,
          userId: data['userId'],
          artist: data['artist'],
          label: data['label'],
          description: data['description'],
          avatar: data['avatar'],
          followers: data['followers'],
          albums: data['albums'],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          searchScore: data['searchScore'],
          lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
        }
        topArtists.push(artist);
      }

      return topArtists;

    } else {
      return null;
    }
  }

  async getOneArtist(id:string): Promise<IArtist | null> {
    const q = doc(this.db, 'artist',id);
    const artistSnapshot = await getDoc(q);

    if (artistSnapshot.exists()) {
      const data = artistSnapshot.data();
      return {
        id: artistSnapshot.id,
        userId: data['userId'],
        artist: data['artist'],
        label: data['label'],
        description: data['description'],
        avatar: data['avatar'],
        followers: data['followers'],
        albums: data['albums'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
      };
    } else {
      console.log('No such album!');
      return null;
    }
  }
/*
  async getOneArtistWithDetails(id:string): Promise<IArtistWithDetails | null> {
    const q = doc(this.db, 'artist',id);
    const artistSnapshot = await getDoc(q);

    if (artistSnapshot.exists()) {
      const data = artistSnapshot.data();
      const artist={} as IArtistWithDetails;
      const album = await this.getOneArtist(data['artistId']);
      return {
        id: artistSnapshot.id,
        userId: data['userId'],
        artist: data['artist'],
        label: data['label'],
        description: data['description'],
        avatar: data['avatar'],
        followers: data['followers'],
        albums: data['albums'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
      };


      return albums;
    } else {
      console.log('No such album!');
      return null;
    }
  }
*/
  /** end artist */

  /** start song */

  //update last played songs
  async updateLastPlayed(userId:string,songId: string) {
    try {
      const historySongRef = collection(this.db, 'user/'+userId+'/lastPlayed');
      const q = query(historySongRef, where('songId', '==', songId));
      const songsSnapshot = await getDocs(q);


      const songList = songsSnapshot.docs.map((doc) => doc.data());
      if(songList.length <= 0) {
        const lastplayedRef = doc(historySongRef);
        const data = { songId: songId,createdAt: new Date(), updatedAt: new Date};
        return await setDoc(lastplayedRef,data);
      } else {
        const updatePromises = songsSnapshot.docs.map(docsnapshot =>
          updateDoc(docsnapshot.ref,{updatedAt: new Date()})
        );
        await Promise.all(updatePromises);

      }
    } catch (error) {
      console.error('Error updating last played:', error);
    }
  }

  //get last played by updated date
  async  getLastPlayed(userId : string,limitCount: number) : Promise<ILastPlayedWithDetails[]|null> {
    const historySongRef = collection(this.db, 'user/'+userId+'/lastPlayed');
    const q = query(historySongRef, orderBy('updatedAt', 'desc'), limit(limitCount));
    const lastPlayedSnapshot = await getDocs(q);
    if (!lastPlayedSnapshot.empty) {
      const lastPlayeds: ILastPlayedWithDetails[] = [];

      for (const doc of lastPlayedSnapshot.docs) {
        const data = doc.data();
        const song = await this.getOneSong(data['songId']);
        if(song) {
          const lastplayed: ILastPlayed = {
            id: doc.id,
            songId : data['songId'],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
          };
          const lastPlayedWithDetails : ILastPlayedWithDetails = { ...lastplayed, song};

          lastPlayeds.push(lastPlayedWithDetails);
        }
      }

      return lastPlayeds;

    } else {
      return null;
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

      const artist = await this.getOneArtist(song.artistId);
      const album = await this.getOneAlbum(song.albumId);

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
      const artist = await this.getOneArtist(data['artistId']);
      const album = await this.getOneAlbum(data['albumId']);

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




  /** end song */

  /** start playlist */

  async  getTopPlaylist(userId : string,limitCount: number): Promise<IPlaylist[]|null> {
    // Récupérer l'utilisateur connecté

    const playlistRef = collection(this.db, 'user/'+userId+'/playlist');
    const q = query(playlistRef, orderBy('lastUpdatedPlayedScore', 'desc'), orderBy('playedScore', 'desc'), limit(limitCount));
    const playlistSnapshot = await getDocs(q);
    if(!playlistSnapshot.empty){
      const playlists: IPlaylist[] = [];
      playlistSnapshot.forEach((doc) => {
        const data = doc.data();
        playlists.push({
          id: doc.id,
          name: data['name'],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          playedScore: data['playedScore'],
          lastUpdatedPlayedScore: data['lastUpdatedPlayedScore'].toDate(),
          song: data['song'],
        });
     });
      return playlists;
    }else
      return null;

  }


  async  getPlaylistMusic(userId:string,playlistId : string,limitCount: number): Promise<ISongWithDetails[]|null> {
    const q = doc(this.db, 'user/'+userId+'/playlist',playlistId);
    const playlistSnapshot = await getDoc(q);
    console.log(userId,playlistId);
    if(playlistSnapshot.exists()){
      const songs: ISongWithDetails[] = [];
      const data = playlistSnapshot.data();
      console.log(data)
      if (data && data['song']) {
        for (const id of data['song']) {
          const song = await this.getOneSong(id);

          if (song) {
            songs.push(song);
          }
          if (songs.length >= limitCount) break;
        }
      }

      return songs;
    }else
      return null;

  }


  /** end playlist */

 /** start search */

  // Search with title and filter by artist or album or song or all
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

      const artist = await this.getOneArtist(song.artistId);
      const album = await this.getOneAlbum(song.albumId);

      if (artist && album) {
        songs.push({ ...song, artist, album });
      }
    }

    return songs;
  }

  private async searchArtists(searchTerm: string | null, limitCount: number): Promise<IArtist[]> {
    const collectionRef = collection(this.db, 'artist');
    let q;

    if (searchTerm && searchTerm.trim() !== '') {
      const start = searchTerm;
      const end = searchTerm + '\uf8ff';
      q = query(collectionRef, orderBy('artist'), startAt(start), endAt(end), limit(limitCount));
    } else {
      q = query(collectionRef, orderBy('artist'), limit(limitCount));
    }

    const artistSnapshot = await getDocs(q);
    const artists: IArtist[] = [];

    for (const doc of artistSnapshot.docs) {
      const data = doc.data();
      const artist: IArtist = {
        id: doc.id,
        userId: data['userId'],
        artist: data['artist'],
        label: data['label'],
        description: data['description'],
        avatar: data['avatar'],
        followers: data['followers'],
        albums: data['albums'],
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        searchScore: data['searchScore'],
        lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
      };

      artists.push(artist);
    }

    return artists;
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
      const artist = await this.getOneArtist(data['artistId']);

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

  async searchWithTitle(searchTerm: string | null, limitCount: number, searchFilter: string): Promise<ISongWithDetails[] | IArtist[] | IAlbum[] | any> {
    if (searchFilter === 'song') {
      return this.searchSongs(searchTerm, limitCount);
    } else if (searchFilter === 'artist') {
      return this.searchArtists(searchTerm, limitCount);
    } else if (searchFilter === 'album') {
      return this.searchAlbums(searchTerm, limitCount);
    } else if (searchFilter === 'all') {
      const [songs, artists, albums] = await Promise.all([
        this.searchSongs(searchTerm, limitCount),
        this.searchArtists(searchTerm, limitCount),
        this.searchAlbums(searchTerm, limitCount),
      ]);
      return { artists, songs, albums };
    } else {
      throw new Error('Invalid search filter');
    }
  }
/** end search */
   /** Observables */

   getOneAlbumObservable(id:string) : Observable<IAlbumsWithDetails | null> {
    const albumDocRef = doc(this.db, 'album', id);
    return from(getDoc(albumDocRef)).pipe(
      switchMap(albumSnapshot => {
        if (albumSnapshot.exists()) {
          const data = albumSnapshot.data();
          return this.getOneArtistObservable(data['artistId']).pipe(
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

  getOneArtistObservable(id: string): Observable<IArtist | null> {
    const artistDocRef = doc(this.db, 'artist', id);
    return from(getDoc(artistDocRef)).pipe(
      map(artistSnapshot => {
        if (artistSnapshot.exists()) {
          const data = artistSnapshot.data();
          return {
            id: artistSnapshot.id,
            userId: data['userId'],
            artist: data['artist'],
            label: data['label'],
            description: data['description'],
            avatar: data['avatar'],
            followers: data['followers'],
            albums: data['albums'],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
            searchScore: data['searchScore'],
            lastUpdatedSearchScore: data['lastUpdatedSearchScore'].toDate(),
          } as IArtist;
        } else {
          console.log('No such artist!');
          return null;
        }
      })
    );
  }



   getOneSongObservable(id:string): Observable<ISongWithDetails | null> {
    const songDocRef = doc(this.db, 'song', id);
    return from(getDoc(songDocRef)).pipe(
      switchMap(songSnapshot => {
        if (songSnapshot.exists()) {
          const data = songSnapshot.data();
          return this.getOneArtistObservable(data['artistId']).pipe(
            switchMap(artist => this.getOneAlbumObservable(data['albumId']).pipe(
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

  getUserLastPlayedWithSongDetails(userId: string,limitCount: number): Observable<ILastPlayedWithDetails[]|null> {
    const historySongRef = collection(this.db, 'user/'+userId+'/lastPlayed');
    const q = query(historySongRef, orderBy('updatedAt', 'desc'), limit(limitCount));

    return from(getDocs(q)).pipe(
      switchMap(lastPlayedSnapshot => {
        if (!lastPlayedSnapshot.empty) {
          const lastPlayeds$ = lastPlayedSnapshot.docs.map(doc => {
            const data = doc.data();
            return this.getOneSongObservable(data['songId']).pipe(
              map(song => {
                if (song) {
                  const lastplayed: ILastPlayed = {
                    id: doc.id,
                    songId: data['songId'],
                    createdAt: data['createdAt'].toDate(),
                    updatedAt: data['updatedAt'].toDate(),
                  };
                  const lastPlayedWithDetails: ILastPlayedWithDetails = { ...lastplayed, song };
                  return lastPlayedWithDetails;
                } else {
                  return null;
                }
              })
            );
          });

          return combineLatest(lastPlayeds$).pipe(
            map(lastPlayeds => lastPlayeds.filter(lp => lp !== null) as ILastPlayedWithDetails[])
          );
        } else {
          return of(null);
        }
      })
    );

  }

  getSongs(): Observable<ISong[]> {
    const songsCol = collection(this.db, 'song');

    const songsSnapshot = from(getDocs(songsCol));

    return songsSnapshot.pipe(
      map(
        (snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ISong[]
      )
    );
  }

}
