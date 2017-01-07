import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page.component";
import {AppComponent} from "./app.component";
import {SignInPageComponent} from "./sign-in-page.component";
import {SignUpPageComponent} from "./sign-up-page.component";
import {NotFoundPageComponent} from "./not-found-page.component";
import {FormsModule} from "@angular/forms";
import {AccountPageComponent} from "./account-page.component";
import {StripeService} from "./stripe.service";

const appRoutes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'sign-in', component: SignInPageComponent },
    { path: 'sign-up', component: SignUpPageComponent },
    { path: 'account', component: AccountPageComponent },
    { path: '**', component: NotFoundPageComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        SignInPageComponent,
        SignUpPageComponent,
        AccountPageComponent,
        NotFoundPageComponent
    ],
    providers: [
        StripeService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
