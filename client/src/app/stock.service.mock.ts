import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { of as observableOf, BehaviorSubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class StockServiceMock {
	private selectedSymbol = 'A';
	private selectedPrice$ = new BehaviorSubject<number>(null);

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
		this.selectedPrice$.next(1.23);
		return this.selectedPrice$.asObservable();
	}
	updateEstimate(maxInvestment) {
		return observableOf(8);
	}
}
