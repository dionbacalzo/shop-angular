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
import { ShopComponent } from './feature/shop/shop.component';
import { ShopFormComponent } from './feature/shop-form/shop-form.component';
import { LoginComponent } from './feature/login/login.component';
import { MessageComponent } from './feature/message/message.component';
import { SignupComponent } from './feature/signup/signup.component';
import { AccountResetComponent } from './feature/account-reset/account-reset.component';
import { CarouselComponent, CarouselItem } from './feature/carousel/carousel.component';

import { ShopRestService } from './service/shop-rest.service';
import { MessageService } from './service/message.service';
import { AuthenticationService } from './service/authentication.service';
import { AdminService } from './service/admin.service';

import { HomepageComponent } from './page/homepage/homepage.component';
import { AdminpageComponent } from './page/adminpage/adminpage.component';
import { SignuppageComponent } from './page/signuppage/signuppage.component';
import { UpdatepageComponent } from './page/updatepage/updatepage.component';

const appRoutes: Routes = [
	{
		path: 'shop/admin',
		component: AdminpageComponent
	},
	{
		path: 'shop/signup',
		component: SignuppageComponent
	},
	{
		path: 'shop/update',
		component: UpdatepageComponent
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
		HomepageComponent,
		CarouselComponent,
		CarouselItem,
		AdminpageComponent,
		AccountResetComponent,
		SignuppageComponent,
		UpdatepageComponent
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
		ShopRestService,
		AdminService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
