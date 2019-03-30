import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';

fdescribe('StockService', () => {
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

	it('should get and set selectedSymbol', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.setSelectedSymbol).toBeDefined();
		expect(stockService.getSelectedSymbol).toBeDefined();
		expect(stockService.getSelectedSymbol()).toBe('');
		expect(stockService.setSelectedSymbol('ABC')).toBeTruthy();
		expect(stockService.getSelectedSymbol()).toBe('ABC');
	});

	it('should fetch reference data', function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.fetchRefData).toBeDefined();
		const testData = [{symbol: 'A', name: 'Ann'}, {symbol: 'B', name: 'Bob' }];
		expect(stockService.fetchRefData().constructor.name).toBe('Observable');
		stockService.fetchRefData().pipe(take(1)).subscribe();
		const req = httpTestingController.expectOne(
			req => {
				return req.url.includes('ref-data');
			}
		);
		req.flush(testData);
	});

	it('should provide price of selected stock', fakeAsync(function () {
		const stockService: StockService = TestBed.get(StockService);
		expect(stockService.providePriceOfSelected).toBeDefined();
		// const testData = [1.00, 1.25, 1.50];
		// expect(stockService.providePriceOfSelected().constructor.name).toBe('Subject');
		stockService.providePriceOfSelected().pipe(take(1)).subscribe((val) => {
			console.log('got val:', val);
		});
		tick(5000);
		// const requests = httpTestingController.match(req => req.url.includes('price'));
		const req = httpTestingController.expectOne(
			req => {
				clearInterval(stockService.pricePollInterval)
				return req.url.includes('price');
			}
		);
		req.flush(3);
		// expect(requests.length).toBe(2);
		tick(5000);
		// requests[0].flush(new HttpErrorResponse({ error: '404' }));
		// requests[1].flush(new HttpErrorResponse({ error: '404' }));
	}));
});
