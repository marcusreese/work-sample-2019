import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

describe('StockService', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController
	beforeEach(function () {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, HttpClientModule],
			providers: [StockService]
		  });
		httpTestingController = TestBed.get(HttpTestingController); 
		httpClient = TestBed.get(HttpClient);
	});
	afterEach(function () {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	it('should be created', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService).toBeTruthy();
	});

	it('should get and set selectedSymbol and get latest price', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.setSelectedSymbol).toBeDefined();
		expect(stockService.getSelectedSymbol).toBeDefined();
		expect(stockService.getSelectedSymbol()).toBe('');
		expect(stockService.setSelectedSymbol('ABC')).toBeTruthy();
		expect(stockService.getSelectedSymbol()).toBe('ABC');
		httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		).flush(1.23);
	});

	it('should fetch reference data', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.fetchRefData).toBeDefined();
		const testData = [{symbol: 'A', name: 'A-STOCK'}, {symbol: 'B', name: 'B-STOCK' }];
		expect(stockService.fetchRefData().constructor.name).toBe('Observable');
		stockService.fetchRefData().pipe(take(1)).subscribe();
		httpTestingController.expectOne(
			req => {
				return req.url.includes('ref-data');
			}
		).flush(testData);
	});

	it('should update maxInvestment and provide maxShares', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.updateEstimate).toBeDefined();
		const returned = stockService.updateEstimate(654);
		expect(returned.constructor.name).toBe('Observable');
		expect(stockService.maxInvestment).toBe(654);
		stockService.setSelectedSymbol('ABC');
		httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		).flush(100);
		expect(stockService.maxShares$.value).toBe(6);
	});

	it('should provide a way to buy', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.buy).toBeDefined();
		expect(stockService.results$).toBeDefined();
		expect(stockService.results$.value).toBe('');
		stockService.buy();
		expect(stockService.results$.value).not.toContain('Bought');
		expect(stockService.results$.value).toContain('Unexpected error');
		expect(stockService.results$.value).toContain('did not attempt to spend $0');
		expect(stockService.results$.value).toContain('for unknown stock');
		stockService.setSelectedSymbol('A');
		httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		).flush(100);
		stockService.maxInvestment = 500;
		stockService.buy();
		httpTestingController.expectOne(
			req => {
				return req.url.includes('purchases');
			}
		).flush({placeholder: 'response'});
		expect(stockService.results$.value).toContain(
			'Bought');
	});
});
