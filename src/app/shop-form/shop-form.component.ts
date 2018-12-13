import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { InventoryItem } from '../inventory-item';	

import { ShopRestService } from '../shop-rest.service';	
import { MessageService } from '../message.service';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.css']
})
export class ShopFormComponent implements OnInit {
	hideItemList: boolean = true;
	saveResult = '';
	productForm = this.fb.group({
		itemList: new FormArray([])
	});

	constructor(private rest:ShopRestService, 
		private route: ActivatedRoute, 
		private router: Router,
		private fb: FormBuilder,
		private titleService: Title,
		public messageService: MessageService) { }

	ngOnInit() {
		this.titleService.setTitle( 'Shop Display: Form' );
		this.messageService.clear();		
		this.getContent();
	}

	createItem(): FormGroup {
		return this.fb.group(new InventoryItem());
	}

	addProduct(): void {		
		this.itemList.push(this.createItem());
	}

	resetProducts(): void {
		this.getContent();
	}

	get itemList() {
		return this.productForm.get('itemList') as FormArray;
	}

	getContent() {
		this.itemList.reset();
		this.productForm = this.fb.group({
			itemList: new FormArray([])
		});
		this.rest.getContent().subscribe((data: {}) => {
			if(data){
				if (data['itemList'].length) {
					data['itemList'].forEach(dataContent => {		      		      
				      this.itemList.push(this.fb.group(new InventoryItem(dataContent)));
				    });
				    this.hideItemList = false;
			    } else {
					let message = {
						title: "Error",
						type: "warn",
						body: "No Items found"
					};
					this.messageService.add(message);
					this.hideItemList = true;
				}		  
			} else {
				this.hideItemList = true;
			}
		});
	}

	onSubmit() {
		// TODO: Use EventEmitter with form value
		//console.warn(this.productForm.value);
		this.saveResult = '';
		this.rest.saveContent(this.productForm.value).subscribe((data: {}) => {
			this.saveResult = JSON.stringify(data);
		});
	}

}
