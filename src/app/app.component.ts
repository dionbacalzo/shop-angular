import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {    

	  constructor(private authService: AuthenticationService) { }

    ngOnInit() {
      this.authService.setAuthentication().subscribe();      
    }

    logout() {
		  this.authService.logout().subscribe();
    }    

    get isAuthenticated(): boolean{        
      return this.authService.authenticated;
    }
}
