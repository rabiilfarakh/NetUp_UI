import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDTOReq, CommentDTORes } from '../../comment/model/comment.model';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments'; 

  constructor(private http: HttpClient) {}

  // Create (POST)
  createComment(comment: CommentDTOReq): Observable<CommentDTORes> {
    return this.http.post<CommentDTORes>(this.apiUrl, comment);
  }

  // Read (GET)
  getCommentById(id: number): Observable<CommentDTORes> {
    return this.http.get<CommentDTORes>(`${this.apiUrl}/${id}`);
  }

  getCommentsByArticleId(articleId: number): Observable<CommentDTORes[]> {
    return this.http.get<CommentDTORes[]>(`${this.apiUrl}/article/${articleId}`);
  }

  // Update (PUT)
  updateComment(id: number, comment: CommentDTOReq): Observable<CommentDTORes> {
    return this.http.put<CommentDTORes>(`${this.apiUrl}/${id}`, comment);
  }

  // Delete (DELETE)
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}