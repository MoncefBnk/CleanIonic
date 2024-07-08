import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, and, collection, doc, endAt, getDoc, getDocs, getFirestore, increment, limit, or, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';
import { Observable, catchError, forkJoin, from, map, of, switchMap } from 'rxjs';
import { RequestResponse } from '../interfaces/response';
import { IArtist, IArtistWithAlbumsAndSongs } from '../interfaces/artist';


@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor() { }

   //update artist score
   async updateArtistScore(id:string) : Promise<void> {
    const artistRef = doc(this.db, 'artist',id);
    try {
      updateDoc(artistRef,{searchScore: increment(1)})
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }
  
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

  getArtists(): Observable<IArtist[]> {
    const artistsCol = collection(this.db, 'artist');

    return from(getDocs(artistsCol)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const artistData = doc.data();
          return {
            id: doc.id,
            userId: artistData['userId'],
            artist: artistData['artist'],
            label: artistData['label'],
            description: artistData['description'],
            avatar: artistData['avatar'],
            followers: artistData['followers'],
            albums: artistData['albums'],
            createdAt: artistData['createdAt'].toDate(),
            updatedAt: artistData['updatedAt'].toDate(),
            searchScore: artistData['searchScore'],
            lastUpdatedSearchScore: artistData['lastUpdatedSearchScore'].toDate(),
          } as IArtist;
        })
      ),
      catchError(err => {
        console.error('Error fetching artists', err);
        return of([] as IArtist[]);
      })
    );
  }

}
