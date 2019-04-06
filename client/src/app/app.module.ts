import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StockSelectComponent } from './stock-select/stock-select.component';
import { StockService } from './stock.service';
import { SetInvestmentComponent } from './set-investment/set-investment.component';

@NgModule({
  declarations: [
    AppComponent,
    StockSelectComponent,
    SetInvestmentComponent
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
