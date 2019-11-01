import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Profile } from './types';

const API_ENDPOINT = 'http://localhost:3000/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
  	private http: HttpClient) { }

  /**
  * Save a New profile to Server
  *
  */
  saveProfile(profile: FormData): Observable<Profile> {
    console.log("TRYING")

    if ( profile.has('_id') ) return this.updateProfile( profile );

  	return this.http.post<Profile>(`${API_ENDPOINT}/new`, profile);
  }

  /**
  * Update an existing profile on Server
  *
  */
  updateProfile(profile: FormData): Observable<Profile> {
    if(! profile.has('_id')) {
      throw Error("[_id] property missing from Profile Object");
    }
    console.log("WOW")
    return this.http.post<Profile>(`${API_ENDPOINT}/${profile.get('_id')}/update`, profile);
  }

  /**
  * Return the list of Profiles
  *
  */
  getProfiles(): Observable<Profile[]> {
  	return this.http.get<Profile[]>(`${API_ENDPOINT}/`);
  }

  getProfile(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${API_ENDPOINT}/${id}`);
  }



}
