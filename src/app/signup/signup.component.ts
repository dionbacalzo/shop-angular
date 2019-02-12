import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import {
	MessageService,
	Message,
	ErrorMessage
} from '../service/message.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	credentials = { username: '', password: '', role: 'USER' };

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		private titleService: Title,
		private messageService: MessageService
	) {}

	ngOnInit() {
		this.titleService.setTitle('Shop Display: Signup');
		this.redirect();
		this.messageService.clear();
	}

	signup() {
		this.authService.signup(this.credentials, data => {
			if (data) {
				this.messageService.clear();
				if (data.status === 'FAIL') {
					this.messageService.add(
						new ErrorMessage({
							messageDisplay: data.message
						})
					);
				} else {
					this.messageService.add(
						new Message({
							type: 'info',
							messageDisplay: data.message
						})
					);
				}
			}
		});
	}

	redirect() {
		if (this.authService.authenticated === false) {
			this.authService.getUser().subscribe(data => {
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
