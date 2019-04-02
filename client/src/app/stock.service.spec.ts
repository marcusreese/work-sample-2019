import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
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
		const req = httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		);
		req.flush(1.23);
	});

	it('should fetch reference data', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.fetchRefData).toBeDefined();
		const testData = [{symbol: 'A', name: 'A-STOCK'}, {symbol: 'B', name: 'B-STOCK' }];
		expect(stockService.fetchRefData().constructor.name).toBe('Observable');
		stockService.fetchRefData().pipe(take(1)).subscribe();
		const req = httpTestingController.expectOne(
			req => {
				return req.url.includes('ref-data');
			}
		);
		req.flush(testData);
	});
});
