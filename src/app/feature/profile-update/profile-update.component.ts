import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

import { MessageService, ErrorMessage, Message } from '../../service/message.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'profile-update',
	templateUrl: './profile-update.component.html',
	styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
	user = { firstname: '', lastname: '' };
	profileForm: FormGroup;
	hideProfileForm: boolean;

	constructor(
		private authService: AuthenticationService,
		private userService: UserService,
		private router: Router,
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.redirect();
		this.hideProfileForm = false;
		this.profileForm = new FormGroup({
			'firstname': new FormControl(this.user.firstname, Validators.required),
			'lastname': new FormControl(this.user.lastname, Validators.required)
		});
		this.initilializeProfileDetails();		
	}

	get firstname() { return this.profileForm.get('firstname'); }
	get lastname() { return this.profileForm.get('lastname'); }

	initilializeProfileDetails() {
		this.hideProfileForm = true;
		this.userService.retrieveProfile().subscribe(data => {
			if (data) {
				this.messageService.clear();
				this.user.firstname = data.firstname;
				this.user.lastname = data.lastname;

				this.profileForm = new FormGroup({
					'firstname': new FormControl(this.user.firstname, Validators.required),
					'lastname': new FormControl(this.user.lastname, Validators.required)
				});
			} else {
				this.messageService.add(
					new ErrorMessage({
						messageDisplay: 'Unable to retrieve Profile'
					})
				);
			}
			this.hideProfileForm = false;
		});
	}

	update() {
		this.hideProfileForm = true;
		this.user = this.profileForm.value;
		let formData:FormData = new FormData();		
		formData.append('user', JSON.stringify(this.user));
		this.messageService.clear();
		this.userService.update(formData).subscribe( data => {
			if (data) {				
				if (data) {
					this.user.firstname = data.firstname;
					this.user.lastname = data.lastname;
					//update user info globally
					this.authService.user = data;

					this.messageService.add(
						new Message({
							type: 'info',
							messageDisplay: 'Successfully updated profile'
						})
					);
				} else {
					this.messageService.add(
						new ErrorMessage({
							messageDisplay: 'Unable to update profile'
						})
					);
				}
			}
			this.hideProfileForm = false;
		});
	}

	redirect() {
		if (this.authService.authenticated === false) {
			this.authService.getUser().subscribe(data => {
				if (this.authService.authenticated === false) {
					this.router.navigateByUrl('/shop');
				}
			});
		}
	}
}
