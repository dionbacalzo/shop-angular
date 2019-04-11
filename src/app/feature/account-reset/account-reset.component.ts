import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormArray
} from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { User } from '../../object/user';
import { MessageService, Message } from '../../service/message.service';

@Component({
	selector: 'account-reset',
	templateUrl: './account-reset.component.html',
	styleUrls: ['./account-reset.component.css']
})
export class AccountResetComponent implements OnInit {
	emptyUserList = false;
	errorUserList = false;
	hideResetForm = true;
	saveResult = '';
	resetForm = this.formBuilder.group({
		users: new FormArray([])
	});
	contentEdited: boolean;
	resetAccountList = [];
	@ViewChild('resetInnerContainer') private resetInnerContainer: ElementRef;	

	constructor(private adminRest: AdminService,
		private formBuilder: FormBuilder,
		private messageService: MessageService, 
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.getUserList();
	}

	get users() {
		return this.resetForm.get('users') as FormArray;
	}

	getUserList() {
		this.adminRest.getContent().subscribe((data) => {
			this.setResetForm(data);
			this.setresetInnerContainerClass();
		}, err => {
			//hide loading screen
			this.errorUserList = true;
		}, () => {
			//hide loading screen, will pass through here after an authorization error
			if (!this.users.value.length) {
				this.emptyUserList = true;
			}
		});
	}

	setResetForm(data) {
		this.resetForm = this.formBuilder.group({
			users: new FormArray([])
		});
		if (data && data.users && data.users.length) {
			data.users.forEach(dataContent => {
				const user = new User(dataContent);
				const userFormGroup = new FormGroup({
					username: new FormControl(user.username),
					firstname: new FormControl(user.firstname),
					lastname: new FormControl(user.lastname),
					role: new FormControl(user.role)
				});

				this.users.push(userFormGroup);
			});
			this.hideResetForm = false;
		}
		else {
			this.hideResetForm = false;
			this.emptyUserList = true;
		}
	}

	toggleEditable(event) {
		let userChecked = {
			username: event.target.value
		};
		if (event.target.checked) {
			this.contentEdited = true;
			this.resetAccountList.push(userChecked);
		} else {
			this.resetAccountList.forEach((item, index) => {
				if (item.username === userChecked.username) {
					this.resetAccountList.splice(index, 1)
				};
			});
		}
	}

	reset() {
		this.adminRest.resetAccounts(this.resetAccountList).subscribe((data) => {
			this.setResetForm(data);
			this.messageService.clear();
			this.messageService.add(
				new Message({
					type: 'info',
					messageDisplay: 'Reset of Account Login Chances is Successfull'
				})
			);
			this.setresetInnerContainerClass();
		}, err => {
			//hide loading screen
			this.errorUserList = true;
		}, () => {
			//hide loading screen, will pass through here after an authorization error
			if (!this.users.value.length) {
				this.emptyUserList = true;
			}
		});
	}

	resetInnerContainerClass = {
		'resetInnerContainer': false,
		'resetInnerContainer-overflow': true
	}

	/**
	 * removes the scroll bar if there is no overflow
	 */
	setresetInnerContainerClass() {
		// check first for changes before check for overflow
		this.cdRef.detectChanges();	
		if (this.resetInnerContainer && this.resetInnerContainer.nativeElement) {
			let element = this.resetInnerContainer.nativeElement;
			if (element.scrollHeight <= element.clientHeight) {
				this.resetInnerContainerClass = {
					'resetInnerContainer': true,
					'resetInnerContainer-overflow': false
				}
			}
		}
	}

}
