import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  limit,
  query,
  where,
  orderBy,
  doc
} from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';
import { ISong, ISongWithDetails } from '../interfaces/song';
import { IAlbum } from '../interfaces/album';
import { IPlaylist } from '../interfaces/user';
import { IArtist } from '../interfaces/artist';



@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor() {}

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

  async getOneAlbum(id:string) : Promise<IAlbum | null> {
    const q = doc(this.db, 'album',id);
    const albumSnapshot = await getDoc(q);
    if (albumSnapshot.exists()) {
      const data = albumSnapshot.data();
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
      };
    } else {
      console.log('No such album!');
      return null;
    }
  }

  //Get top album
  async  getTopAlbums(limitCount: number){
    const albumsRef = collection(this.db, 'album');
    const q = query(albumsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const albumSnapshot = await getDocs(q);
    /*const topAlbums = albumSnapshot.docs.map((doc) => doc.data());
  
    return topAlbums;*/
    const topAlbums: IAlbum[] = [];
      albumSnapshot.forEach((doc) => {
      const data = doc.data();
      topAlbums.push({
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
        });
      });

      return topAlbums;
    
  }

  
  // Get a list of cities from your database
  async getAlbums() {
    const albumsCol = collection(this.db, 'albums');
    const albumsSnapshot = await getDocs(albumsCol);
    const albumsList = albumsSnapshot.docs.map((doc) => doc.data());
    return albumsList;
  }

  async getAlbums2() {
    const albumsCol = collection(this.db, 'albums');
    const q = query(albumsCol, where('artist.name', '==', 'Mike'), limit(3));
    const albumsSnapshot = await getDocs(q);
    const albumsList = albumsSnapshot.docs.map((doc) => doc.data());
    console.log(albumsList);
    return albumsList;
  }


  /** end album */

  /** start artist */

  async  getTopArtists(limitCount: number) {
    const artistsRef = collection(this.db, 'artist');
    const q = query(artistsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const artistSnapshot = await getDocs(q);
    const topArtists = artistSnapshot.docs.map((doc) => doc.data());
  
    return topArtists;
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

  /** end artist */

  /** start song */

  async  getLastPlayed(userId : string,limitCount: number) {
    const historySongRef = collection(this.db, 'user/'+userId+'/searchHistory');
    const q = query(historySongRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const playlistSnapshot = await getDocs(q);
    const lastPlayeds = playlistSnapshot.docs.map((doc) => doc.data());
  
    return lastPlayeds;
  }
  
  async  getTopSongs(limitCount: number): Promise<ISong[]> {
    const songsRef = collection(this.db, 'song');
    const q = query(songsRef, orderBy('searchScore', 'desc'), limit(limitCount));
    const songSnapshot = await getDocs(q);
    /*const topSongs = songSnapshot.docs.map((doc) => doc.data());
  

    return topSongs;*/

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

  /** end song */

  /** start playlist */
  
  async  getTopPlaylist(userId : string,limitCount: number): Promise<IPlaylist[]> {
    // Récupérer l'utilisateur connecté
    const userRef = collection(this.db, 'user',userId);

    const playlistRef = collection(userRef,'playlist');

    const q = query(playlistRef, orderBy('lastUpdatedPlayedScore', 'desc'), orderBy('playedScore', 'desc'), limit(limitCount));
    const playlistSnapshot = await getDocs(q);
    const playlists: IPlaylist[] = [];
    playlistSnapshot.forEach((doc) => {
    const data = doc.data();
    playlists.push({
      id: doc.id,
      name: data['name'],
      createdAt: data['createdAt'].toDate(),
      updatedAt: data['updatedAt'].toDate(),
      playedScore: data['playedScore'],
      lastUpdatedPlayedScore: data['lastUpdatedPlayedSong'].toDate(),
      song: data['song'],
    });
  });

  return playlists;
  }

  /** end playlist */


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
      };

      const artist = await this.getOneArtist(song.artistId);
      const album = await this.getOneAlbum(song.albumId);

      if (artist && album) {
        songs.push({ ...song, artist, album });
      }
    }

    console.log(songs);
    return songs;
  }
  
}
