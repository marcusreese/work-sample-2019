import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPurchaseComponent } from './stock-purchase.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StockService } from '../stock.service';
import { StockServiceMock } from '../stock.service.mock';

describe('StockPurchaseComponent', () => {
	let component: StockPurchaseComponent;
	let fixture: ComponentFixture<StockPurchaseComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StockPurchaseComponent],
			imports: [
				BrowserModule,
				HttpClientModule,
				FormsModule,
				ReactiveFormsModule,
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
		fixture = TestBed.createComponent(StockPurchaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render an input', () => {
		const fixture = TestBed.createComponent(StockPurchaseComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('input')).toBeTruthy();
	});
});
