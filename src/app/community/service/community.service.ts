  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { environment } from '../../../environments/environment';
  import { CommunityDTOReq, CommunityDTORes } from '../model/community.model';


  @Injectable({
    providedIn: 'root'
  })
  export class CommunityService {

    private apiUrl = `${environment.apiUrl}/api/communities`;

    constructor(private http: HttpClient) { }

    createCommunity(community: CommunityDTOReq): Observable<CommunityDTORes> {
      return this.http.post<CommunityDTORes>(this.apiUrl, community);
    }

    getAllCommunities(): Observable<CommunityDTORes[]> {
      return this.http.get<CommunityDTORes[]>(this.apiUrl);
    }

    getCommunityById(id: number): Observable<CommunityDTORes> {
      return this.http.get<CommunityDTORes>(`${this.apiUrl}/${id}`);
    }

    updateCommunity(id: number, community: CommunityDTOReq): Observable<CommunityDTORes> {
      return this.http.patch<CommunityDTORes>(`${this.apiUrl}/${id}`, community);
    }

    deleteCommunity(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }
