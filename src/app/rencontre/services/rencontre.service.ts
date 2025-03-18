// rencontre.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rencontre, RencontreRequest } from '../model/rencontre.model';

@Injectable({
  providedIn: 'root'
})
export class RencontreService {
  private apiUrl = 'http://localhost:8080/api/appointments'; 

  constructor(private http: HttpClient) {}

  getAllRencontres(): Observable<Rencontre[]> {
    return this.http.get<Rencontre[]>(this.apiUrl);
  }

  getRencontreById(id: number): Observable<Rencontre> {
    return this.http.get<Rencontre>(`${this.apiUrl}/${id}`);
  }

  createRencontre(rencontre: RencontreRequest): Observable<Rencontre> {
    return this.http.post<Rencontre>(this.apiUrl, rencontre);
  }

  joinRencontre(rencontreId: number, userId: number): Observable<Rencontre> {
    return this.http.post<Rencontre>(`${this.apiUrl}/${rencontreId}/join/${userId}`, {});
  }
}

