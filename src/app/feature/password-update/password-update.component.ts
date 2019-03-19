import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

import { MessageService, ErrorMessage, Message } from '../../service/message.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.css']
})
export class PasswordUpdateComponent implements OnInit {
  user = { password: '', newPassword: '', newPasswordRetype: '' };
  passwordForm: FormGroup;
  hidePasswordForm: boolean;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.redirect();
    this.hidePasswordForm = false;
    this.passwordForm = new FormGroup({
      'password': new FormControl(this.user.password, Validators.required),
      'newPassword': new FormControl(this.user.newPassword, Validators.required),
      'newPasswordRetype': new FormControl(this.user.newPasswordRetype, Validators.required)
    }, {
        validators: [this.MustMatch('newPassword', 'newPasswordRetype'),
        this.MustNotMatch('password', 'newPassword')]
      });
  }

  get password() { return this.passwordForm.get('password'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get newPasswordRetype() { return this.passwordForm.get('newPasswordRetype'); }

  updatePassword() {
    this.hidePasswordForm = true;
    this.user = this.passwordForm.value;
    this.userService.updatePassword(this.user).subscribe(data => {
      this.messageService.clear();
      if (data) {
        this.messageService.clear();
        if (data.status === 'FAIL') {
          this.messageService.add(
            new ErrorMessage({
              messageDisplay: data.message
            })
          );
        } else {
          this.passwordForm.reset();
          this.messageService.add(
            new Message({
              type: 'info',
              messageDisplay: data.message
            })
          );
        }
      }
      this.hidePasswordForm = false;
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  MustNotMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustNotMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value === matchingControl.value) {
        matchingControl.setErrors({ mustNotMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
