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

	it('should get and set symbolToBuy and get latest price', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.setSymbolToBuy).toBeDefined();
		expect(stockService.getSymbolToBuy).toBeDefined();
		expect(stockService.getSymbolToBuy()).toBe('');
		expect(stockService.setSymbolToBuy('ABC')).toBeTruthy();
		expect(stockService.getSymbolToBuy()).toBe('ABC');
		httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		).flush(1.23);
	});

	it('should fetch reference data', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.fetchRefData).toBeDefined();
		const testData = [{ symbol: 'A', name: 'A-STOCK' }, { symbol: 'B', name: 'B-STOCK' }];
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
		stockService.setSymbolToBuy('ABC');
		httpTestingController.expectOne(
			req => {
				return req.url.includes('price');
			}
		).flush(100);
		expect(stockService.maxShares$.value).toBe(6);
	});

	it('should provide a way to buy', () => {
		const stockService: StockService = TestBed.get(StockService);
		let results = '';
		stockService.getResults$().subscribe((text) => results = text);
		expect(results).toBe('');
		stockService.buy();
		expect(results).not.toContain(`Purchase completed sucessfully . . .`);
		expect(results).toContain(`Purchase attempt failed harmlessly . . .`);
		stockService.setSymbolToBuy('A');
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
		).flush({
			"data": {
				"Date and time": "Sun Apr 07 2019 01:21:53 GMT-0600",
				"Stock ticker symbol": "AA",
				"Maximum investment": "$85.00",
				"Price per share": "$29.5500",
				"Number of shares purchased": 2,
				"Total investment": "$59.10",
				"Purchase ID": "c9f3186c-eeb1-4046-8cfc-9460f73fb2fb"
			},
			"status": 200
		});
		expect(results).toContain(`Purchase completed sucessfully . . .`);
	});
});
