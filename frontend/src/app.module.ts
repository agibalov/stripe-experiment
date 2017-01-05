import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page.component";
import {AppComponent} from "./app.component";
import {SignInPageComponent} from "./sign-in-page.component";
import {SignUpPageComponent} from "./sign-up-page.component";
import {NotFoundPageComponent} from "./not-found-page.component";

const appRoutes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'sign-in', component: SignInPageComponent },
    { path: 'sign-up', component: SignUpPageComponent },
    { path: '**', component: NotFoundPageComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        SignInPageComponent,
        SignUpPageComponent,
        NotFoundPageComponent
    ],
    providers: [ ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
