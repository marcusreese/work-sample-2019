import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { of as observableOf, BehaviorSubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class StockServiceMock {
	private selectedSymbol = '';
	private selectedPrice$ = new BehaviorSubject<number>(null);
	results$ = new BehaviorSubject<string>('');

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

	getSelectedSymbol() {
		return this.selectedSymbol;
	}

	setSelectedSymbol(symbol) {
		this.selectedSymbol = symbol;
		this.providePriceOfSelected();
		return true;
	}

	providePriceOfSelected() {
		if (this.selectedSymbol) {
			this.selectedPrice$.next(1.23);
		} else {
			this.selectedPrice$.next(null);
		}
		return this.selectedPrice$.asObservable();
	}

	updateEstimate(maxInvestment) {
		return observableOf(8);
	}

	buy() {
		this.results$.next('test result');
	}
}
