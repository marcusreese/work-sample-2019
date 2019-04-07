import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { of as observableOf, BehaviorSubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class StockServiceMock {
	private symbolToBuy = '';
	private selectedPrice$ = new BehaviorSubject<number>(null);
	results$ = new BehaviorSubject<string>('');
	extraResults$ = new BehaviorSubject<string>('');
	maxShares$ = new BehaviorSubject<number>(5);

	constructor() {}

	fetchRefData() {
		return observableOf({
			A: {
				full: [{symbol: 'A', name: 'A-STOCK'}],
				symbols: ['A']
			},
			B: {
				full: [{symbol: 'B', name: 'B-STOCK' }],
				symbols: ['B']
			}
		});
	}

	getSymbolToBuy() {
		return this.symbolToBuy;
	}

	setSymbolToBuy(symbol) {
		this.symbolToBuy = symbol;
		this.providePriceOfSelected();
		return true;
	}

	providePriceOfSelected() {
		if (this.symbolToBuy) {
			this.selectedPrice$.next(1.23);
		} else {
			this.selectedPrice$.next(null);
		}
		return this.selectedPrice$.asObservable();
	}

	updateEstimate(maxInvestment) {
		return observableOf(8);
	}

	getResults$() {
		return this.results$.asObservable();
	}

	getExtraResults$() {
		return this.extraResults$.asObservable();
	}

	buy() {
		this.results$.next('test result');
		return Promise.resolve();
	}
}
