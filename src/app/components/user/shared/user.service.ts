import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from './user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'api/users';

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.url + '/getAll');
  }

  addNewUser(user: UserModel): Observable<any> {
    return this.http.post(this.url + '/add', user);
  }

  editUser(user: UserModel): Observable<any> {
    return this.http.put(this.url + '/update', user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.url + '/delete/' + id);
  }
}
