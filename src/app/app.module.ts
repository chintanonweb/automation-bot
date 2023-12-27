import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AutomationModule } from './automation/automation.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AutomationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
