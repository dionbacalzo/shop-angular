import { Component, OnInit } from '@angular/core';
import { ShopRestService } from '../shop-rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

	products:any = {};

	constructor(public rest:ShopRestService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.getContent();
	}

	getContent() {
		this.products = {};
		this.rest.getContent().subscribe((data: {}) => {
			console.log(data);
			this.products = data;
		});
	}

}
