import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';

const appRoutes: Routes = [
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
    ShopComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
	FormsModule,
	BrowserModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
