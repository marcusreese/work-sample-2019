import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take, retryWhen, delay } from 'rxjs/operators';
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
	private results$ = new BehaviorSubject<string>('');
	private extraResults$ = new BehaviorSubject<string>('');

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
		this.pricePollInterval = setInterval(this.pollForLatestPrice, 5 * 1000);
		return this.selectedPrice$.asObservable();
	}

	pollForLatestPrice() {
		if (!this.selectedSymbol) {
			return;
		}
		this.http.get(`https://api.iextrading.com/1.0/stock/${this.selectedSymbol}/price`)
			.pipe(
				retryWhen(errors => errors.pipe(delay(3000)))
				// take(1)
			).subscribe((val: number) => {
				if (val === undefined || val.constructor.name === 'HttpErrorResponse') {
					clearInterval(this.pricePollInterval);
					this.selectedPrice$.next(null);
				} else {
					this.selectedPrice$.next(val);
					this.updateEstimate(this.maxInvestment);
				}
			}, (err: HttpErrorResponse) => {
				this.selectedPrice$.next(null);
			});
	}

	updateEstimate(maxInvestment: number) {
		this.maxInvestment = maxInvestment;
		if (this.selectedPrice$.value && maxInvestment) {
			this.maxShares$.next(Math.floor(maxInvestment / this.selectedPrice$.value));
		} else {
			this.maxShares$.next(null);
		}
		return this.maxShares$.asObservable();
	}

	getResults$() {
		return this.results$.asObservable();
	}

	getExtraResults$() {
		return this.extraResults$.asObservable();
	}

	buy() {
		return new Promise((resolve) => {
			if (!this.selectedSymbol || !this.maxInvestment) {
				this.logPurchaseInfo(null, undefined, 0);
				resolve();
			} else {
				const { selectedSymbol: stockSymbol, maxInvestment } = this;
				const url = 'http://localhost:3000/api/v1/purchases'; // process.env.PURCHASES_URL;
				this.http.post(url, { stockSymbol, maxInvestment }).subscribe((res: any) => {
					const { time, price, numSharesBought, id} = res.data;
					console.log('no price?', res.data);
					this.logPurchaseInfo(time, price, numSharesBought, id);
					resolve();
				}, (err) => {
					// If the API server is up but has lost connection to the IEX API,
					// then the API server returns data and message.
					const { data = {}, message = '' } = err.error;
					const { price, numSharesBought } = data;
					const msg = message ? message.split('\n') : navigator.onLine ?
						[`Our API server may be down.`] :
						[`Check your internet connection?`];
					this.logPurchaseInfo(null, price, numSharesBought, null, msg);
					resolve();
				})
			}
		});
	}

	logPurchaseInfo(time: number, price = 0, numShares = 0, id?: string, other = []) {
		const topMessage = id ? `Purchase completed sucessfully . . .`
			: `Purchase attempt failed harmlessly . . .`;
		const maxInv = this.maxInvestment ? '$' + (this.maxInvestment.toFixed(2)) : null;
		const total = price * numShares;
		this.results$.next([
			// TODO use date from server
			new Date(time).toString().split(' (')[0],
			topMessage,
			`Stock Symbol: ${this.selectedSymbol || 'Unknown'}`,
			`Maximum Investment: ${ maxInv || 'Unknown'}`,
			`Price per share: ${price ? '$' + price.toFixed(4) : 'Unknown'}`,
			`Number of shares purchased: ${numShares}`,
			`Total investment: $${total.toFixed(2)}`,
			`ID: ${id || 'None'}`,
			...other
		].join('\n') + '\n\n' + this.results$.value);
	}

	get() {
		return new Promise((resolve) => {
			const url = 'http://localhost:3000/api/v1/purchases'; // process.env.PURCHASES_URL;
			return this.http.get(url).subscribe((res: any) => {
				console.log('got:', res)
				this.logExtraInfo(true, JSON.stringify(res, null, 2).split('\n'));
				resolve();
			}, (err) => {
				// If the API server is up but has lost connection to the IEX API,
				// then the API server returns data and message.
				const { data = {}, message = '' } = err.error;
				const { price, numSharesBought } = data;
				const msg = message ? message.split('\n') : navigator.onLine ?
					[`Our API server may be down.`] :
					[`Check your internet connection?`];
				this.logExtraInfo(false, msg);
				resolve();
			});
		});
	}

	logExtraInfo(isOkay: boolean, messages = []) {
		const topMessage = isOkay ? `API interaction completed sucessfully . . .`
			: `API interaction failed harmlessly . . .`;
		this.extraResults$.next([
			new Date().toString().split(' (')[0],
			topMessage,
			...messages
		].join('\n') + '\n\n' + this.extraResults$.value);
	}
}
