import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class StockService {
	private selectedSymbol = '';
	private selectedPrice$ = new Subject();
	pricePollInterval: any; // TS complains about both Timer and number

	constructor(private http: HttpClient) {}

	fetchRefData() {
		return this.http.get('https://api.iextrading.com/1.0/ref-data/symbols').pipe(
			map((arr: any[]) => arr.reduce((obj, next) => {
				const name = next['symbol'];
				Array(8).fill(true).forEach((v, n) => { // 8 is max num chars in symbol
					if (!name[n]) {
						return;
					}
					const firstNChars = name.slice(0, n + 1);
					let val = obj[firstNChars];
					if (!val) {
						val = obj[firstNChars] = { full: [], symbols: [] };
					}
					val.full.push(next);
					val.symbols.push(name);
				});
				return obj;
			}, {}))
		);
	}

	getSelectedSymbol() {
		return this.selectedSymbol;
	}

	setSelectedSymbol(symbol) {
		this.selectedSymbol = symbol;
		return true;
	}

	providePriceOfSelected() {
		this.pricePollInterval = setInterval(() => {
			this.http.get(`https://api.iextrading.com/1.0/stock/${this.selectedSymbol}/price`)
				.pipe(take(1))
				.subscribe((val: number) => {
					if (val === undefined || val.constructor.name === 'HttpErrorResponse') {
						clearInterval(this.pricePollInterval);
						this.selectedPrice$.error(NaN);
					} else {
						this.selectedPrice$.next(val);
					}
				}, (err: HttpErrorResponse) => {
					console.log(`Error from getting price with "${this.selectedSymbol}":`, err);
					clearInterval(this.pricePollInterval);
					this.selectedPrice$.error(NaN);
				});
		}, 5000);
		return this.selectedPrice$;
	}

}