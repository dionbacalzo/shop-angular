import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from '../../service/message.service';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

	pictureSrc: String | ArrayBuffer = 'assets/images/default-pic.png';

	constructor(
		private authService: AuthenticationService,
		private titleService: Title,
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.titleService.setTitle('Shop Display: Home');
		this.messageService.clear();
		
		if(this.user.picture) {
			this.pictureSrc = 'data:image/png;base64,' + this.user.picture;
		}
	}

	get isAuthenticated(): boolean {
		return this.authService.authenticated;
	}

	get user() {
		return this.authService.user;
	}
}
