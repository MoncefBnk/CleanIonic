import { Injectable, inject } from '@angular/core';
import { ERole, ILastPlayed, ILastPlayedWithDetails, IPlaylist, IUser } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore/lite';
import { IElement } from '../interfaces/element';
import { ArtistService } from './artist.service';
import { AlbumService } from './album.service';
import { SongService } from './song.service';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';
import { ISongWithDetails } from '../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private artistservice = inject(ArtistService);
  private albumservice = inject(AlbumService);
  private songservice = inject(SongService);

  constructor() { }

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
              const artist = await this.artistservice.getOneArtist(data['id']);
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
              const album = await this.albumservice.getOneAlbum(data['id']);
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
              const song = await this.songservice.getOneSong(data['id']);
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
            const artist = await this.artistservice.getOneArtist(data['id']);
            const album = await this.albumservice.getOneAlbum(data['id']);
            const song = await this.songservice.getOneSong(data['id']);

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


  getUserLastPlayedWithSongDetails(userId: string,limitCount: number): Observable<ILastPlayedWithDetails[]|null> {
    const historySongRef = collection(this.db, 'user/'+userId+'/lastPlayed');
    const q = query(historySongRef, orderBy('updatedAt', 'desc'), limit(limitCount));

    return from(getDocs(q)).pipe(
      switchMap(lastPlayedSnapshot => {
        if (!lastPlayedSnapshot.empty) {
          const lastPlayeds$ = lastPlayedSnapshot.docs.map(doc => {
            const data = doc.data();
            return this.songservice.getOneSongObservable(data['songId']).pipe(
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
        const song = await this.songservice.getOneSong(data['songId']);
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
          const song = await this.songservice.getOneSong(id);

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
}
