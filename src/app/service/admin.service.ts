import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import {
	HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const endpoint = 'http://localhost:8080/shop/';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }

	private extractData(res: Response) {
		const body = res;
		return body || {};
	}

	getContent(): Observable<any> {
		return this.http.get(endpoint + 'accountResetList').pipe(
			map(this.extractData),
			catchError(
				this.messageService.handleObservableError<{}>(
					'Unable to retrieve Item List'
				)
			)
		);
	}

	resetAccounts(accountList): Observable<any> {
		this.messageService.clear();

		if (accountList) {
			return this.http.post(endpoint + 'resetAccount', accountList).pipe(
				map(this.extractData),
				catchError(
					this.messageService.handleObservableError<{}>(
						'Unable to reset account'
					)
				)
			);
		} else {
			this.messageService.clear();
			this.messageService.handleObservableError(
				'Unable to reset accounts: Invalid Content'
			);
		}
	}
	
}
