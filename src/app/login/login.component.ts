import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';

import { MessageService, Message, ErrorMessage } from '../service/message.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	credentials = { username: '', password: '', rememberMe: '' };
	loginForm: FormGroup;

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.loginForm = new FormGroup({
			'username': new FormControl(this.credentials.username, Validators.required),
			'password': new FormControl(this.credentials.password, Validators.required),
			'rememberMe': new FormControl(this.credentials.rememberMe),
		});
		// no need to redirect now that login component is at homepage
		// this.redirect();
		// this.messageService.clear();
	}

	get username() { return this.loginForm.get('username'); }

	get password() { return this.loginForm.get('password'); }

	get rememberMe() { return this.loginForm.get('rememberMe'); }

	login() {
		this.credentials = this.loginForm.value;
		this.authService.authenticate(this.credentials, data => {
			if (data) {
				this.messageService.clear();
				if (data.status === 'FAIL') {
					this.messageService.add(new ErrorMessage({
						messageDisplay: data.message
					}));
				} else {
					this.messageService.add(
						new Message({
							type: 'info',
							messageDisplay: data.message,
							persist: 0
						})
					);
					this.router.navigateByUrl('/shop');
				}
			}
		});
	}

	redirect() {
		if (this.authService.authenticated === false) {
			this.authService.setAuthentication().subscribe(() => {
				if (this.authService.authenticated === true) {
					this.router.navigateByUrl('/shop');
				}
			});
		} else {
			if (this.authService.authenticated === true) {
				this.router.navigateByUrl('/shop');
			}
		}
	}
}
