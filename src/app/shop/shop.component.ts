import { Component, OnInit } from '@angular/core';
import { ShopRestService } from '../shop-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

	products:any = {};

	constructor(public rest:ShopRestService, private route: ActivatedRoute, 
		private router: Router, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle( 'Shop Display: Home' );
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
