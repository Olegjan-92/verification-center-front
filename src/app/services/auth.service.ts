import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../components/user/shared/user-model';

@Injectable()
export class AuthService implements CanActivate {

  private url = '/api';

  constructor(private router: Router,
              private http: HttpClient) {
  }

  canActivate() {
    if (this.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  getToken(): UserModel {
    return JSON.parse(localStorage.getItem('token'));
    // return new UserModel();
  }

  login(login: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', {login, password});
  }

  register(user: UserModel): Observable<any> {
    return this.http.post(this.url + '/register', user);
  }

  logout() {
    localStorage.removeItem('user');
    document.location.reload();
  }
}
