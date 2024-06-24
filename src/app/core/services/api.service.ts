import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private apiUrl = environment.url_api;

  constructor() { }

  getSongById(songId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stream/${songId}`, { responseType: 'blob' });
  }

  getAlbumImageById(albumId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/album/image/${albumId}`, { responseType: 'text' });
  }
}
