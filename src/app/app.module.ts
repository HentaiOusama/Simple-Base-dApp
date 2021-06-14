import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LinkedIconMakerComponent} from './linked-icon-maker/linked-icon-maker.component';
import {AppRoutingModule} from "./app.routes";
import {HomePageComponent} from "./home-page/home-page.component";
import {ErrorPageComponent} from './error-page/error-page.component';

@NgModule({
    declarations: [
        AppComponent,
        LinkedIconMakerComponent,
        HomePageComponent,
        ErrorPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
