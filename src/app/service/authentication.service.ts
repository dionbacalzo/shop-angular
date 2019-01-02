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
import { Observable, of, Subject } from "rxjs";
import { Router } from "@angular/router";
import { map, catchError, tap, finalize } from "rxjs/operators";

import { MessageService, ErrorMessage } from "./message.service";

const endpoint = "http://localhost:8080/shop/";
const httpOptions = {
	loginHeaders: new HttpHeaders({
		"Content-Type": "application/x-www-form-urlencoded"
	})
};
@Injectable({
	providedIn: "root"
})
export class AuthenticationService implements HttpInterceptor {
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

		return next.handle(request).pipe(
			catchError(
				(
					error: HttpErrorResponse,
					caught: Observable<HttpEvent<any>>
				): Observable<HttpEvent<any>> => {
					//catch authentication errors
					if (error.status === 401 || error.status === 403) {
						this.messageService.clear();
						this.authenticated = false;

						this.messageService.add(
							new ErrorMessage({
								messageDisplay: "Login to continue"
							})
						);
						//immediately stop further processes and display error message
						return of(undefined as HttpEvent<any>);
					} else {
						throw caught;
					}
				}
			)
		);
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
					this.authenticated = true;
					return callback && callback(data);
				},
				error => {
					this.authenticated = false;
					this.messageService.clear();
					this.messageService.handleError(
						error,
						"You are unable to login at this moment"
					);
				}
			);
	}

	logout() {
		let logoutParams = new HttpParams().set("logout", "logout");
		this.messageService.clear();
		return this.http
			.post(endpoint + "logout", logoutParams, { responseType: "text" })
			.pipe(
				tap(data => {
					this.authenticated = false;
					this.router.navigateByUrl("/shop/login");
				}),
				catchError(
					this.messageService.handleObservableError<{}>(
						"Unable to Logout. Try again Later"
					)
				)
			);
	}
}
