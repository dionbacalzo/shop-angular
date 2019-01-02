import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {    

	  constructor(private authService: AuthenticationService) { }

    logout() {
		  this.authService.logout().subscribe();;
    }

    get isAuthenticated(): boolean{        
      return this.authService.authenticated;
    }
}
