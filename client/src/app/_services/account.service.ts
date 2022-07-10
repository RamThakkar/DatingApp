import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl = 'https://localhost:7259/api/';
  private currrentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currrentUserSource.asObservable();

  constructor(private httpclient: HttpClient) { }

  login(model: any) {
    return this.httpclient.post(this.baseurl + 'account/login', model).pipe(
      map((respose: User) => {
        const user = respose;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currrentUserSource.next(user);
        }
      })
    );
  }

  register(model:any){
    return this.httpclient.post(this.baseurl+'account/register',model).pipe(
      map((user:User)=>{
        if (user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currrentUserSource.next(user);
        }        
      })      
    )

  }

  setCurrentUser(user: User) {
    this.currrentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currrentUserSource.next(null);
  }
}