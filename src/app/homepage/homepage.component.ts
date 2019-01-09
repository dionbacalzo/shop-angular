import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService } from "../service/message.service";
import { AuthenticationService } from "../service/authentication.service";

@Component({
	selector: "app-homepage",
	templateUrl: "./homepage.component.html",
	styleUrls: ["./homepage.component.css"]
})
export class HomepageComponent implements OnInit {


	constructor(
		private authService: AuthenticationService,
		private titleService: Title,
		private messageService: MessageService
	) {}

	ngOnInit() {
		this.titleService.setTitle("Shop Display: Home");
		this.messageService.clear();
	}

	get isAuthenticated(): boolean {
		return this.authService.authenticated;
	}
}
