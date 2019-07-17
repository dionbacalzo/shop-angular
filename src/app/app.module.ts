import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { ShopComponent } from './feature/shop/shop.component';
import { ShopFormComponent } from './feature/shop-form/shop-form.component';
import { LoginComponent } from './feature/login/login.component';
import { MessageComponent } from './feature/message/message.component';
import { SignupComponent } from './feature/signup/signup.component';
import { AccountResetComponent } from './feature/account-reset/account-reset.component';
import { CarouselComponent, CarouselItem } from './feature/carousel/carousel.component';
import { ProfileUpdateComponent } from './feature/profile-update/profile-update.component';
import { PasswordUpdateComponent } from './feature/password-update/password-update.component';

import { ShopRestService } from './service/shop-rest.service';
import { MessageService } from './service/message.service';
import { AuthenticationService } from './service/authentication.service';
import { AdminService } from './service/admin.service';
import { UserService } from './service/user.service';

import { HomepageComponent } from './page/homepage/homepage.component';
import { AdminpageComponent } from './page/adminpage/adminpage.component';
import { SignuppageComponent } from './page/signuppage/signuppage.component';
import { UpdatepageComponent } from './page/updatepage/updatepage.component';
import { ProfilepageComponent } from './page/profilepage/profilepage.component';
import { AuthGuard } from './auth.guard';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'shop/content',
        pathMatch: 'full'
    },
    {
        path: 'shop',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'content',
                pathMatch: 'full'
            },
            {
                path: 'content',
                component: HomepageComponent
            },
            {
                path: 'profile',
                component: ProfilepageComponent
            },
            {
                path: 'admin',
                component: AdminpageComponent
            },
            {
                path: 'signup',
                component: SignuppageComponent
            },
            {
                path: 'update',
                component: UpdatepageComponent
            }            
        ]
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
        UpdatepageComponent,
        ProfilepageComponent,
        ProfileUpdateComponent,
        PasswordUpdateComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes,{ useHash: true }),
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
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        MessageService,
        ShopRestService,
        AdminService,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
