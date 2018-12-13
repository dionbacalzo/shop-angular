import { Component } from '@angular/core';
import { ShopRestService } from './shop-rest.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {    

	  constructor(private rest: ShopRestService) { }

    logout() {
		  this.rest.logout();
    }

    isAuthenticated(){        
      return this.rest.authenticated;
    }
}
