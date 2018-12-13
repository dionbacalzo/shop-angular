import { Component, OnInit } from '@angular/core';
import { ShopRestService } from '../shop-rest.service';	
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MessageService } from '../message.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {

  credentials = {username: '', password: '', rememberMe: ''};

  constructor(private rest: ShopRestService, 
  	private http: HttpClient, 
  	private router: Router,
  	private titleService: Title,
  	public messageService: MessageService) {
  }

	ngOnInit() {
		this.titleService.setTitle( 'Shop Display: Login' );        
    this.redirect();
		this.messageService.clear()		
	}

  login() {
    this.rest.authenticate(this.credentials, () => {
        this.router.navigateByUrl('/shop');
    });
  }

  redirect(){    
    this.rest.getAuthentication().subscribe((data)=> {       
      if(data === 'true'){
        this.router.navigateByUrl('/shop');
      }
    });      
  }

}