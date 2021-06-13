import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LinkedIconMakerComponent } from './linked-icon-maker/linked-icon-maker.component';

@NgModule({
  declarations: [
    AppComponent,
    LinkedIconMakerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
