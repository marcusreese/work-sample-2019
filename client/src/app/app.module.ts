import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StockSelectComponent } from './stock-select/stock-select.component';
import { StockService } from './stock.service';
import { StockPurchaseComponent } from './stock-purchase/stock-purchase.component';

@NgModule({
  declarations: [
    AppComponent,
    StockSelectComponent,
    StockPurchaseComponent
  ],
  imports: [
	BrowserModule,
	HttpClientModule,
    FormsModule,
	ReactiveFormsModule,
	MatAutocompleteModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	BrowserAnimationsModule
  ],
  providers: [StockService],
  bootstrap: [AppComponent]
})
export class AppModule { }
