import { Injectable } from "@angular/core";
import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse,
	HttpParams,
	HttpRequest,
	HttpHandler,
	HttpInterceptor,
	HttpEvent
} from "@angular/common/http";
import { Observable, of, empty } from "rxjs";
import { Router } from "@angular/router";
import { map, catchError, tap, finalize } from "rxjs/operators";

import { MessageService } from "./message.service";

const endpoint = "http://localhost:8080/shop/";
@Injectable({
	providedIn: "root"
})
export class ShopRestService {
	data: any;

	constructor(
		private http: HttpClient,
		private router: Router,
		private messageService: MessageService
	) {}

	private extractData(res: Response) {
		let body = res;
		return body || {};
	}

	getContent(): Observable<any> {
		return this.http.get(endpoint + "viewListUnparsed").pipe(
			map(this.extractData),
			catchError(
				this.messageService.handleObservableError<{}>(
					"Unable to retrieve Item List"
				)
			)
		);
	}

	saveContent(productList: {}): Observable<any> {
		this.messageService.clear();

		if (productList) {
			return this.http.post(endpoint + "save", productList).pipe(
				map(this.extractData),
				catchError(
					this.messageService.handleObservableError<{}>(
						"Unable to Save Item List: Invalid Content"
					)
				)
			);
		} else {
			this.messageService.clear();
			this.messageService.handleObservableError(
				"Unable to Save Item List: Invalid Content"
			);
		}
	}
}
