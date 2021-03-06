import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSelectComponent } from './stock-select.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';
import { StockService } from '../stock.service';
import { StockServiceMock } from '../stock.service.mock';

describe('StockSelectComponent', () => {
	let component: StockSelectComponent;
	let fixture: ComponentFixture<StockSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StockSelectComponent],
			imports: [
				BrowserModule,
				HttpClientModule,
				FormsModule,
				ReactiveFormsModule,
				MatAutocompleteModule,
				MatFormFieldModule,
				MatInputModule,
				NoopAnimationsModule
			],
			providers: [
				{
					provide: StockService,
					useClass: StockServiceMock
				}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StockSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render an input with autocomplete and place for full name', () => {
		const fixture = TestBed.createComponent(StockSelectComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('input')).toBeTruthy();
		expect(compiled.querySelector('mat-form-field')).toBeTruthy();
		expect(compiled.querySelector('mat-autocomplete')).toBeTruthy();
		expect(compiled.querySelector('.full-stock-name')).toBeTruthy();
	});

	it('should respond to input change', () => {
		const fixture = TestBed.createComponent(StockSelectComponent);
		spyOn(fixture.componentInstance, 'onChange').and.callThrough();
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		const fullStockName = compiled.querySelector('.full-stock-name');
		expect(fullStockName.textContent.trim()).toBeFalsy();

		// change input
		const input = compiled.querySelector('input');
		input.value = 'A';
		input.dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
		expect(fullStockName.textContent.trim()).toBe('A-STOCK'); // see stock.service.mock
		
		input.value = '';
		input.dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(2);
		expect(fullStockName.textContent.trim()).toBeFalsy();
	});

	it('should warn if symbol is invalid', () => {
		const fixture = TestBed.createComponent(StockSelectComponent);
		spyOn(fixture.componentInstance, 'onChange').and.callThrough();
		fixture.componentInstance.filteredOptions$ = observableOf(['A', 'AA']);
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		const fullStockName = compiled.querySelector('.full-stock-name');
		expect(fullStockName.textContent.trim()).toBeFalsy();

		// change input
		const input = compiled.querySelector('input');
		input.value = 'WeirdString';
		input.dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
		expect(fullStockName.textContent.trim()).toBe('(Invalid symbol)');
	});


	it('should respond to autocomplete selection', () => {
		const fixture = TestBed.createComponent(StockSelectComponent);
		spyOn(fixture.componentInstance, 'onChange').and.callThrough();
		fixture.componentInstance.filteredOptions$ = observableOf(['A', 'AA']);
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		const fullStockName = compiled.querySelector('.full-stock-name');
		expect(fullStockName.textContent.trim()).toBeFalsy();
		const input = compiled.querySelector('input');
		expect(input.value).toBeFalsy();

		// make option visible
		expect(document.querySelector('mat-option')).toBeFalsy();
		input.dispatchEvent(new Event('focusin'));
		const options = document.querySelectorAll('mat-option');
		expect(options.length).toBe(1); // see stock.service.mock

		// select option
		const optSelect = new Event('optionSelected') as any;
		optSelect.option = { value: 'AA' };
		(options[0] as any).click();
		document.querySelector('mat-autocomplete').dispatchEvent(optSelect);
		fixture.detectChanges();
		expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
	});

	it('should show latest price', () => {
		const fixture = TestBed.createComponent(StockSelectComponent);
		fixture.componentInstance.showPrice = true;
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('.latest-price')).toBeFalsy();
		const input = compiled.querySelector('input');
		input.value = 'A';
		input.dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(compiled.querySelector('.latest-price')).toBeTruthy();
	});

});
