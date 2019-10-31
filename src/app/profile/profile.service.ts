import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_ENDPOINT = 'http://localhost:3000/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
  	private http: HttpClient) { }


  saveProfile(profile): Observable<any> {
  	return this.http.post<any>(`${API_ENDPOINT}/new`, profile);
  }



}
