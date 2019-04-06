import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInvestmentComponent } from './set-investment.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StockService } from '../stock.service';
import { StockServiceMock } from '../stock.service.mock';

describe('SetInvestmentComponent', () => {
	let component: SetInvestmentComponent;
	let fixture: ComponentFixture<SetInvestmentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SetInvestmentComponent],
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
		fixture = TestBed.createComponent(SetInvestmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render an input', () => {
		const fixture = TestBed.createComponent(SetInvestmentComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('input')).toBeTruthy();
	});

	it('should estimate number of shares', () => {
		const fixture = TestBed.createComponent(SetInvestmentComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('.max-shares')).toBeFalsy();
	});
});
