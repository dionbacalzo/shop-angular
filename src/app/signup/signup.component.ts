import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../service/authentication.service";
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

import {
	MessageService,
	Message,
	ErrorMessage
} from "../service/message.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.component.html",
	styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
	credentials = { username: "", password: "", role: "USER" };

	constructor(
		private authService: AuthenticationService,
		private http: HttpClient,
		private router: Router,
		private titleService: Title,
		private messageService: MessageService
	) {}

	ngOnInit() {
		this.titleService.setTitle("Shop Display: Signup");
		this.redirect();
		this.messageService.clear();
	}

	signup() {
		this.authService.signup(this.credentials, data => {
			if (data) {
				this.messageService.clear();
				if (data === "FAIL") {
					this.messageService.add(
						new ErrorMessage({
							messageDisplay: "Signup Failed"
						})
					);
				} else {
					this.messageService.add(
						new Message({
							type: "info",
							messageDisplay: "Successfully signed up"
						})
					);
				}
			}
		});
	}

	redirect() {
		if (this.authService.authenticated == false) {
			this.authService.setAuthentication().subscribe(data => {
				if (this.authService.authenticated == true) {
					this.router.navigateByUrl("/shop");
				}
			});
		} else {
			if (this.authService.authenticated == true) {
				this.router.navigateByUrl("/shop");
			}
		}
	}
}
