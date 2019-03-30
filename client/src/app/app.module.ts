import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StockSelectComponent } from './stock-select/stock-select.component';
import { StockService } from './stock.service';

@NgModule({
  declarations: [
    AppComponent,
    StockSelectComponent
  ],
  imports: [
	BrowserModule,
	HttpClientModule,
    FormsModule,
	ReactiveFormsModule,
	MatAutocompleteModule,
	MatFormFieldModule,
	MatInputModule,
	BrowserAnimationsModule
  ],
  providers: [StockService],
  bootstrap: [AppComponent]
})
export class AppModule { }
