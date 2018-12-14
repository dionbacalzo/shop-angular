import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";

import { ShopRestService } from "../shop-rest.service";
import { MessageService } from "../message.service";

@Component({
	selector: "app-shop",
	templateUrl: "./shop.component.html",
	styleUrls: ["./shop.component.css"]
})
export class ShopComponent implements OnInit {
	hideItemList: boolean = true;
	products: any = {};

	constructor(
		private rest: ShopRestService,
		private route: ActivatedRoute,
		private router: Router,
		private titleService: Title,
		private http: HttpClient,
		public messageService: MessageService
	) {}

	ngOnInit() {
		this.titleService.setTitle("Shop Display: Home");
		this.messageService.clear();
		this.getContent();
	}

	getContent() {
		this.products = {};
		this.rest.getContent().subscribe((data: {}) => {
			this.products = data;
			if (!this.products) {
				this.hideItemList = true;
			} else if (!this.products.itemList) {
				let message = {
					error: "Error",
					type: "warn",
					messageDisplay: "No Items found"
				};
				this.messageService.add(message);
				this.hideItemList = true;
			} else {
				this.hideItemList = false;
			}
		});
	}
}
