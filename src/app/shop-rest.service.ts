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
import { Observable, of, empty, ObservableInput } from "rxjs";
import { Router } from "@angular/router";
import { map, catchError, tap, finalize } from "rxjs/operators";

import { MessageService, ErrorMessage } from "./message.service";

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
		private messageService: MessageService
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		request = request.clone({
			withCredentials: true
		});

		return next.handle(request);
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
			.subscribe(
				data => {
					this.data = data;
					this.getAuthentication().subscribe();
					return callback && callback();
				},
				catchError(
					this.handleError(
						new ErrorMessage({
							messageDisplay: "Invalid Username or Password"
						})
					)
				)
			);
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
						new ErrorMessage({
							messageDisplay:
								"Unable to retrieve User information. Try again later"
						})
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
					this.getAuthentication().subscribe();
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
		this.getAuthentication().subscribe();

		return this.http.get(endpoint + "viewListUnparsed").pipe(
			map(this.extractData),
			catchError(
				this.handleError<{}>(
					new ErrorMessage({
						messageDisplay: "Unable to retrieve Item List"
					})
				)
			)
		);
	}

	saveContent(productList): Observable<any> {
		this.getAuthentication().subscribe();
		this.messageService.clear();

		if (productList["itemList"]) {
			return this.http
				.post(endpoint + "save", productList["itemList"])
				.pipe(
					map(this.extractData),
					catchError(
						this.handleError(
							new ErrorMessage({
								messageDisplay: "Unable to Retrieve Item List"
							})
						)
					)
				);
		} else {
			this.messageService.clear();
			this.handleError(
				new ErrorMessage({
					messageDisplay: "Unable to Save Item List: Invalid Content"
				})
			);
			return empty();
		}
	}

	public handleError<T>(message?: ErrorMessage<{}>, result?: T) {
		return (error: any, caught: Observable<T>): Observable<T> => {
			// TODO: send the error to remote logging infrastructure

			if (!message) {
				let message = new ErrorMessage({
					errorInfo: error,
					type: "error",
					messageDisplay: "Error has occured"
				});
			} else {
				if (!message.getType()) {
					message.setType("error");
				}
				if (!message.errorInfo) {
					message.errorInfo = error;
				}
			}
			this.messageService.add(message);			
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
