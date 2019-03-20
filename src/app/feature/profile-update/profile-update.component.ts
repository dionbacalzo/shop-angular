import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

import { MessageService, ErrorMessage, Message } from '../../service/message.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
	selector: 'profile-update',
	templateUrl: './profile-update.component.html',
	styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
	user = { firstname: '', lastname: '', picture: null };
	profileForm: FormGroup;
	hideProfileForm: boolean;
	pictureSrc: String | ArrayBuffer;
	@ViewChild('pictureRef') pictureRef: ElementRef;

	constructor(
		private authService: AuthenticationService,
		private userService: UserService,
		private router: Router,
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.authService.redirectToHome(false);
		this.hideProfileForm = false;
		this.updateForm();
		this.initilializeProfileDetails();
	}

	get firstname() { return this.profileForm.get('firstname'); }
	get lastname() { return this.profileForm.get('lastname'); }
	get picture() { return this.profileForm.get('picture'); }

	initilializeProfileDetails() {
		this.pictureSrc = 'assets/images/default-pic.png';
		this.hideProfileForm = true;
		this.userService.retrieveProfile().subscribe(data => {
			if (data) {
				this.messageService.clear();
				this.user.firstname = data.firstname;
				this.user.lastname = data.lastname;
				if (data.picture) {
					this.pictureSrc = 'data:image/png;base64,' + data.picture;
				}
				this.updateForm();
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

	updateForm() {
		this.profileForm = new FormGroup({
			'firstname': new FormControl(this.user.firstname, Validators.required),
			'lastname': new FormControl(this.user.lastname, Validators.required),
			'picture': new FormControl(this.user.picture, Validators.pattern('^(.)+\.(jpg|png|gif|jpeg)$'))
		}, {
				validators: this.maxFileSize('picture', 5242880)
			});
	}

	updatePreview(files) {
		if (files) {
			var reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = (_event) => {
				this.pictureSrc = reader.result;
			}
		}
	}

	update() {
		this.hideProfileForm = true;
		this.user = this.profileForm.value;
		let formData: FormData = new FormData();
		if (this.pictureRef.nativeElement.files) {
			formData.append('picture', this.pictureRef.nativeElement.files[0]);
			this.user.picture = undefined;
			formData.append('user', JSON.stringify(this.user));
		} else {
			formData.append('user', JSON.stringify(this.user));
		}

		this.messageService.clear();
		this.userService.update(formData).subscribe(data => {
			if (data && Object.keys(data).length) {
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
			this.hideProfileForm = false;
		});
	}

	maxFileSize(controlName: string, maxByte: number) {
		return (formGroup: FormGroup): ValidationErrors | null => {
			const control = formGroup.controls[controlName];

			if (control.errors && !control.errors.maxFileSize) {
				// return if another validator has already found an error on the control
				return;
			}
			let fileSize = 0;
			if (this.pictureRef.nativeElement.files.length) {
				fileSize = this.pictureRef.nativeElement.files[0].size;
			} else {
				return;
			}
			// set error on control if validation fails
			if (fileSize > maxByte) {
				control.setErrors({ maxFileSize: true });
			} else {
				control.setErrors(null);
			}
		};
	}
	
}
