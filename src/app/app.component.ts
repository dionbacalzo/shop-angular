import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	constructor(private authService: AuthenticationService) { }

	ngOnInit() {
		if (!this.isAuthenticated) {
			this.authService.getUser().subscribe();
		}
	}

	logout() {
		this.authService.logout().subscribe();
	}

	get isAuthenticated(): boolean {
		return this.authService.authenticated;
	}
}
