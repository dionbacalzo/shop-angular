import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatDatepickerModule,
	MatNativeDateModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatPaginatorModule,
	MatTableModule,
	MatSortModule,
	MatProgressSpinnerModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { ShopFormComponent } from './shop-form/shop-form.component';
import { LoginComponent } from './login/login.component';

import { ShopRestService } from './service/shop-rest.service';
import { MessageService } from './service/message.service';
import { AuthenticationService } from './service/authentication.service';

import { MessageComponent } from './message/message.component';
import { SignupComponent } from './signup/signup.component';
import { HomepageComponent } from './homepage/homepage.component';

const appRoutes: Routes = [
	{
		path: 'shop/signup',
		component: SignupComponent
	},
	{
		path: 'shop/update',
		component: ShopFormComponent
	},
	{
		path: 'shop/content',
		component: HomepageComponent
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
		MessageComponent,
		SignupComponent,
		HomepageComponent
	],
	imports: [
		RouterModule.forRoot(appRoutes),
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatPaginatorModule,
		MatTableModule,
		MatSortModule,
		MatProgressSpinnerModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthenticationService,
			multi: true
		},
		MessageService,
		ShopRestService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
