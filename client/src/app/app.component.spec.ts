import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StockSelectComponent } from './stock-select/stock-select.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatTabsModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SetInvestmentComponent } from './set-investment/set-investment.component';
import { StockService } from './stock.service';
import { StockServiceMock } from './stock.service.mock';
import { ViewPurchasesComponent } from './view-purchases/view-purchases.component';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent,
				StockSelectComponent,
				SetInvestmentComponent,
				ViewPurchasesComponent
			],
			imports: [
				BrowserModule,
				HttpClientModule,
				FormsModule,
				ReactiveFormsModule,
				MatAutocompleteModule,
				MatFormFieldModule,
				MatInputModule,
				MatTabsModule,
				NoopAnimationsModule
			],
			providers: [
				{
					provide: StockService,
					useClass: StockServiceMock
				}
			]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should render title in a h1 tag', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain('stocks');
	});

	it('should render a stock-select component', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('app-stock-select')).toBeTruthy();
	});

	it('should render a set-investment component', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('app-set-investment')).toBeTruthy();
	});

	it('should be able to submit the form and see results', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		const buyNowButton = compiled.querySelector('.buy');
		expect(buyNowButton).toBeTruthy();
		spyOn(fixture.componentInstance.stockService, 'buy').and.callThrough();
		buyNowButton.click();
		expect(fixture.componentInstance.stockService.buy).toHaveBeenCalledTimes(1);
		fixture.whenStable().then(() => {
			fixture.detectChanges();
			expect(compiled.querySelector('.results').textContent).toContain('test result');
		  });
	});
});
