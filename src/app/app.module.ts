import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { ShopFormComponent } from './shop-form/shop-form.component';
import { LoginComponent } from './login/login.component';

import { ShopRestService } from './shop-rest.service';
import { MessageComponent } from './message/message.component';

const appRoutes: Routes = [
	{
		path: 'shop/login',
		component: LoginComponent
	},
	{
		path: 'shop/upload',
		component: ShopFormComponent
	},
	{
		path: 'shop/content',
		component: ShopComponent
	},
	{ 
		path: 'shop',
		redirectTo: 'shop/content',
		pathMatch: 'full'
	},
	{ 
		path: '',
		redirectTo: 'shop/content',
		pathMatch: 'full'
	}
];

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    ShopFormComponent,
    LoginComponent,
    MessageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
	FormsModule,
	ReactiveFormsModule,
	BrowserModule,
	HttpClientModule
  ],
  providers: [
  	{
    provide: HTTP_INTERCEPTORS,
    useClass: ShopRestService,
    multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
