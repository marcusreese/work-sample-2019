import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class StockService {
	private selectedSymbol = '';
	private pricePollInterval: any; // TS complains about both Timer and number
	selectedPrice$ = new BehaviorSubject<number>(null);
	maxShares$ = new BehaviorSubject<number>(null);
	maxInvestment: number;
	results$ = new BehaviorSubject<string>('');

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
		this.providePriceOfSelected();
		return true;
	}

	providePriceOfSelected() {
		this.pollForLatestPrice();
		this.pricePollInterval = setInterval(this.pollForLatestPrice, 10 * 1000);
		return this.selectedPrice$.asObservable();
	}

	pollForLatestPrice() {
		if (!this.selectedSymbol) {
			return;
		}
		this.http.get(`https://api.iextrading.com/1.0/stock/${this.selectedSymbol}/price`)
			.pipe(take(1))
			.subscribe((val: number) => {
				if (val === undefined || val.constructor.name === 'HttpErrorResponse') {
					clearInterval(this.pricePollInterval);
					this.selectedPrice$.next(null);
				} else {
					this.selectedPrice$.next(val);
					this.updateEstimate(this.maxInvestment);
				}
			}, (err: HttpErrorResponse) => {
				console.log(`Error from getting price with "${this.selectedSymbol}":`, err);
				clearInterval(this.pricePollInterval);
				this.selectedPrice$.next(null);
			});
	}

	updateEstimate(maxInvestment) {
		this.maxInvestment = maxInvestment;
		if (this.selectedPrice$.value && maxInvestment) {
			this.maxShares$.next(Math.floor(maxInvestment / this.selectedPrice$.value));
		} else {
			this.maxShares$.next(null);
		}
		return this.maxShares$.asObservable();
	}

	buy() {
		if (!this.selectedSymbol || !this.maxInvestment) {
			this.addToResults([
				`Unexpected error --`,
				`did not attempt to spend $${this.maxInvestment || 0}`,
				`for ${this.selectedSymbol || 'unknown'} stock`
			]);
			return;
		} else {
			const { selectedSymbol: stockSymbol, maxInvestment } = this;
			const url = 'http://localhost:3000/api/v1/purchases'; // process.env.PURCHASES_URL;
			this.http.post(url, { stockSymbol, maxInvestment }).subscribe((res) => {
				console.log('response from post:', res);
				this.addToResults([
					`Bought ${JSON.stringify(res)}`
				]);
			}, (err) => {
				console.log('err from post:', err);
				this.addToResults([
					`Failed to buy. ${err.message}`
				]);
			})
		}
	}

	addToResults(stringArray) {
		this.results$.next( '\n' + [
			new Date().toLocaleString(),
			...stringArray.map(s => '    ' + s)
		].join('\n') + '\n' + this.results$.value);
	}
}
