import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../service/authentication.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { MessageService, Message, ErrorMessage } from "../service/message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { username: "", password: "", rememberMe: "" };

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    //no need to redirect now that login component is at homepage
    //this.redirect(); 
    //this.messageService.clear();
  }

  login() {
    this.authService.authenticate(this.credentials, data => {
      if (data) {
        this.messageService.clear();        
        if (data === "FAIL") {                    
          this.messageService.add(new ErrorMessage({            
            messageDisplay: "Username or Password is Invalid"
          }));        
        } else {
          this.messageService.add(
            new Message({
              type: "info",
              messageDisplay: "Successfully logged in",
              persist: 0
            })
          );
          this.router.navigateByUrl("/shop");
        }
      }
    });
  }

  redirect() {
    if (this.authService.authenticated == false) {
      this.authService.setAuthentication().subscribe((data) => {
        if (this.authService.authenticated == true) {
          this.router.navigateByUrl("/shop");
        }
      });
    } else {
      if (this.authService.authenticated == true) {
        this.router.navigateByUrl("/shop");
      }
    }
  }
}
