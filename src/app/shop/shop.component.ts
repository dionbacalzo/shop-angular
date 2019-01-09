import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MessageService } from "../service/message.service";
import { ShopRestService } from "../service/shop-rest.service";
import { InventoryItem } from "../inventory-item";


@Component({
	selector: "app-shop",
	templateUrl: "./shop.component.html",
	styleUrls: ["./shop.component.css"]
})
export class ShopComponent implements OnInit {
	hideItemList: boolean = true;
	errorItemList: boolean = false;
	products: any[] =[];

	displayedColumns: string[] = ['title', 'price', 'type', 'manufacturer', 'releaseDate'];
	dataSource: MatTableDataSource<InventoryItem<{}>>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private rest: ShopRestService,
		private route: ActivatedRoute,
		private router: Router,		
		private http: HttpClient,
		private messageService: MessageService
	) { }

	ngOnInit() {		
		//this.messageService.clear();
		this.getContent();
	}

	getContent() {
		this.products = [];
		this.rest.getContent().subscribe((data: {itemList:[]}) => {			
			if (!data) {
				this.hideItemList = true;
				this.errorItemList = true;				
			} else if (!data["itemList"]) {
				let message = {
					error: "Error",
					type: "warn",
					messageDisplay: "No Items found"
				};
				this.messageService.add(message);
				this.hideItemList = true;
			} else {				
				data["itemList"].forEach((item:{}) => {
					this.products.push(new InventoryItem(item));
				});
				
				this.dataSource = new MatTableDataSource(this.products);
				this.dataSource.paginator = this.paginator;
    			this.dataSource.sort = this.sort;
				this.hideItemList = false;
			}
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
}
