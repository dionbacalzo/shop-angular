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
const httpOptions = {
	loginHeaders: new HttpHeaders({
		"Content-Type": "application/x-www-form-urlencoded"
	}),
	logoutHeaders: new HttpHeaders({
		"Content-Type": "application/x-www-form-urlencoded",
		"Access-Control-Allow-Origin": "http://localhost:8080"
	})
};
@Injectable({
	providedIn: "root"
})
export class ShopRestService implements HttpInterceptor {
	data: any;
	authenticated: boolean = false;

	constructor(
		private http: HttpClient,
		private router: Router,
		private message: MessageService
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		request = request.clone({
			withCredentials: true
		});

		return next.handle(request);
		//.pipe(catchError(this.handleError(()=>{})) as any);
	}

	authenticate(credentials, callback) {
		let loginParams = new HttpParams()
			.set("username", credentials.username)
			.set("password", credentials.password)
			.set("rememberMe", credentials.rememberMe);
		this.http
			.post(endpoint + "loginUser", loginParams, {
				headers: httpOptions.loginHeaders,
				responseType: "text"
			})
			.subscribe(data => {
				this.data = data;
				this.getAuthentication().subscribe();
				return callback && callback();
			});
	}

	getAuthentication(): Observable<any> {
		this.authenticated = false;
		return this.http
			.get(endpoint + "isAuthenticated", { responseType: "text" })
			.pipe(
				tap(data => {
					this.authenticated = data === "true";
				}),
				catchError(
					this.handleError(
						"Unable to retrieve User information. Try again later"
					)
				)
			);
	}

	logout() {
		let logoutParams = new HttpParams().set("logout", "logout");

		this.http
			.post(endpoint + "logout", logoutParams, { responseType: "text" })
			.pipe(
				finalize(() => {
					this.getAuthentication();
					this.router.navigateByUrl("/shop/login");
				})
			)
			.subscribe();
	}

	private extractData(res: Response) {
		let body = res;
		return body || {};
	}

	getContent(): Observable<any> {
		this.getAuthentication().subscribe(/*data => {
			console.log(this.authenticated);
		}*/);

		return this.http.get(endpoint + "viewListUnparsed").pipe(
			map(this.extractData),
			catchError(this.handleError("Unable to retrieve Item List"))
		);
	}

	saveContent(productList): Observable<any> {
		this.getAuthentication().subscribe();
		
		if (productList["itemList"]) {
			return this.http
				.post(endpoint + "save", productList["itemList"])
				.pipe(
					map(this.extractData),
					catchError(this.handleError("Unable to Save Item List"))
				);
		} else {
			this.handleError("Unable to Save Item List: Invalid Content");
			return empty();
		}
	}

	public handleError<T>(errMessage?: string, errType?: string, result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure

			if (!errMessage) {
				errMessage = "Error has occured";
			}
			if (!errType) {
				errType = "error";
			}
			let message = {
				title: "Error",
				type: errType,
				body: errMessage
			};
			this.message.add(message);
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
