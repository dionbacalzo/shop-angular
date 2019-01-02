import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormArray,
	Validators
} from "@angular/forms";

import { InventoryItem } from "../inventory-item";

import { ShopRestService } from "../service/shop-rest.service";
import { MessageService, Message } from "../service/message.service";

@Component({
	selector: "app-shop-form",
	templateUrl: "./shop-form.component.html",
	styleUrls: ["./shop-form.component.css"]
})
export class ShopFormComponent implements OnInit {
	hideItemList: boolean = true;
	saveResult: string = "";
	productForm = this.formBuilder.group({
		itemList: new FormArray([])
	});	

	constructor(
		private rest: ShopRestService,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private titleService: Title,
		private messageService: MessageService		
	) {}

	ngOnInit() {
		this.titleService.setTitle("Shop Display: Form");
		this.messageService.clear();		
		this.getContent();
	}

	createItem(): FormGroup {
		return this.formBuilder.group(new InventoryItem());
	}

	addProduct(): void {
		this.itemList.insert(0, this.createItem());
	}

	deleteProduct(item: number): void {		
		this.productForm.markAsTouched();
		this.itemList.removeAt(item);		
	}

	resetProducts(): void {
		this.messageService.clear();
		this.itemList.reset();
		this.productForm = this.formBuilder.group({
			itemList: new FormArray([])
		});
		this.getContent();
	}

	get itemList() {
		return this.productForm.get("itemList") as FormArray;
	}

	getContent() {		
		this.rest.getContent().subscribe((data: {itemList:[]}) => {
			if (data) {
				this.setItemForm(data);
			} else {
				this.hideItemList = true;
			}
		});
	}

	onSubmit() {		
		// TODO: Use EventEmitter with form value		
		let saveData = [];
		this.productForm.value['itemList'].forEach(item =>{
			saveData.push(new InventoryItem(item))
		})		
		
		this.rest.saveContent(saveData).subscribe((data: {itemList:[]}) => {			
			if(data){
				this.itemList.reset();
				this.productForm = this.formBuilder.group({
					itemList: new FormArray([])
				});

				this.setItemForm(data);
				let message = new Message({
					type: "info",
					messageDisplay: "Successfully Saved Items"
				});
				this.messageService.add(message);
			}
		});
	}

	setItemForm(data: {itemList:[]}){
		if (data && data.itemList && data.itemList.length) {
			data.itemList.forEach(dataContent => {
				let item = new InventoryItem(dataContent);
				
				let itemFormGroup = new FormGroup({
					id: new FormControl(item.id),
					title: new FormControl(item.title),
					manufacturer: new FormControl(item.manufacturer),
					price: new FormControl(item.price),
					releaseDate: new FormControl(new Date(item.releaseDate)),
					type: new FormControl(item.type)
				});

				this.itemList.push(itemFormGroup);
			});
			this.hideItemList = false;
		} else {
			let message = new Message({
				type: "warn",
				messageDisplay: "No Items found"
			});
			this.messageService.add(message);
			this.hideItemList = true;
		}
	}
}
