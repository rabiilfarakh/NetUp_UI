import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { ArticleDTOReq, ArticleDTORes } from '../model/article.model';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/api/articles`; 
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Créer un article
  createArticle(article: ArticleDTOReq): Observable<ArticleDTORes> {
    return this.http.post<ArticleDTORes>(this.apiUrl, article, this.httpOptions);
  }

  // Récupérer un article par ID
  getArticleById(id: number): Observable<ArticleDTORes> {
    return this.http.get<ArticleDTORes>(`${this.apiUrl}/${id}`);
  }

  // Récupérer tous les articles
  getAllArticles(): Observable<ArticleDTORes[]> {
    return this.http.get<ArticleDTORes[]>(this.apiUrl);
  }

  // Mettre à jour un article (PATCH)
  updateArticle(id: number, article: ArticleDTOReq): Observable<ArticleDTORes> {
    return this.http.patch<ArticleDTORes>(`${this.apiUrl}/${id}`, article, this.httpOptions);
  }

  // Supprimer un article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}