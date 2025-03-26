import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    NgChartsModule,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 