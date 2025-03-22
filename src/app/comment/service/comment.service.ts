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

  createComment(comment: CommentDTOReq): Observable<CommentDTORes> {
    return this.http.post<CommentDTORes>(this.apiUrl, comment);
  }

  getCommentById(id: number): Observable<CommentDTORes> {
    return this.http.get<CommentDTORes>(`${this.apiUrl}/${id}`);
  }

  getCommentsByArticleId(articleId: number): Observable<CommentDTORes[]> {
    return this.http.get<CommentDTORes[]>(`${this.apiUrl}/article/${articleId}`);
  }

  // updateComment(id: number, comment: CommentDTOReq): Observable<CommentDTORes> {
  //   return this.http.put<CommentDTORes>(`${this.apiUrl}/${id}`, comment);
  // }
  updateComment(commentId: number, comment: CommentDTOReq): Observable<CommentDTORes> {
    return this.http.put<CommentDTORes>(`${this.apiUrl}/${commentId}`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}