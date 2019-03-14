import { Injectable } from '@angular/core';
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Constant } from '../object/constant';
import { Util } from '../object/util';
import { Observable } from 'rxjs';

const httpOptions = {
  contentTypeJson: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  update(user: { firstname: string; lastname: string; }): Observable<any> {
    return this.http
      .post(Constant.endpoint + 'updateUser', user, {
        headers: httpOptions.contentTypeJson
      })
      .pipe(map(Util.extractData),
        catchError(
          this.messageService.handleObservableError<{}>(
            'Unable to update Profile Information'
          )
        ))
  }

  retrieveProfile(): Observable<any> {
    return this.http.get(Constant.endpoint + 'retrieveUser').pipe(
      map(Util.extractData),
      catchError(
        this.messageService.handleObservableError<{}>(
          'Unable to retrieve Profile'
        )
      )
    );
  }

  updatePassword(user): Observable<any> {
    return this.http.post(Constant.endpoint + 'updatePassword', user, {
      headers: httpOptions.contentTypeJson
    }).pipe(
      map(Util.extractData),
      catchError(
        this.messageService.handleObservableError<{}>(
          'Unable to update password'
        )
      )
    );
  }
}
