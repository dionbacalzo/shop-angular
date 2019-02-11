import { Injectable } from '@angular/core';
import {
	HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MessageService } from './message.service';

const endpoint = 'http://localhost:8080/shop/';
@Injectable({
	providedIn: 'root'
})
export class ShopRestService {
	data: any;

	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }

	private extractData(res: Response) {
		const body = res;
		return body || {};
	}

	getContent(): Observable<any> {
		return this.http.get(endpoint + 'viewListUnparsed').pipe(
			map(this.extractData),
			catchError(
				this.messageService.handleObservableError<{}>(
					'Unable to retrieve Item List'
				)
			)
		);
	}

	saveContent(productList: {}): Observable<any> {
		this.messageService.clear();

		if (productList) {
			return this.http.post(endpoint + 'save', productList).pipe(
				map(this.extractData),
				catchError(
					this.messageService.handleObservableError<{}>(
						'Unable to Save Item List: Invalid Content'
					)
				)
			);
		} else {
			this.messageService.clear();
			this.messageService.handleObservableError(
				'Unable to Save Item List: Invalid Content'
			);
		}
	}
}
