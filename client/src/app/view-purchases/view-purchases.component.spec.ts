import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchasesComponent } from './view-purchases.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StockSelectComponent } from '../stock-select/stock-select.component';

describe('ViewPurchasesComponent', () => {
	let component: ViewPurchasesComponent;
	let fixture: ComponentFixture<ViewPurchasesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ViewPurchasesComponent,
				StockSelectComponent
			],
			imports: [
				BrowserModule,
				HttpClientModule,
				FormsModule,
				ReactiveFormsModule,
				MatAutocompleteModule,
				MatTabsModule,
				MatFormFieldModule,
				MatInputModule,
				NoopAnimationsModule
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewPurchasesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
