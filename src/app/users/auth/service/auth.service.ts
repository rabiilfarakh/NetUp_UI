import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { UserRes } from '../../model/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/login'; 
  private baseApiUrl = 'http://localhost:8080/api'; 
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  saveToken(token: string, role: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }

  getUserIdFromToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          return decodedToken.userId != null ? String(decodedToken.userId) : null; // Convert to string
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          return null;
        }
      }
    }
    return null;
  }


  getUserInfo(userId: number | string): Observable<UserRes> {
    return this.http.get<UserRes>(`${this.baseApiUrl}/users/${userId}`);
  }
}