import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserRequest } from '../model/user.model';
import { Observable } from 'rxjs';

const apiUrl = "http://localhost:8080/api/users";

@Injectable({
  providedIn: 'root'
})


export class UserService {

  constructor(private http: HttpClient) { }


  public save(userRequest: UserRequest):Observable<User>{
    console.log("serv", userRequest)
    return this.http.post<any>("http://localhost:8080/api/users",userRequest)
  }

}
