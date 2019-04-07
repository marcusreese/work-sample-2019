import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take, retryWhen, delay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface DbPurchase {
	symbol?: string;
	price_4_dec?: number;
	num_shares?: number;
	max_4_dec?: number;
	time?: number;
	id?: string;
}

export enum SelectType {
	All,
	ById,
	BySymbol
}

@Injectable({
	providedIn: 'root'
})
export class StockService {
	private symbolToBuy = '';
	private pricePollInterval: any; // TS complains about both Timer and number
	selectedPrice$ = new BehaviorSubject<number>(null);
	maxShares$ = new BehaviorSubject<number>(null);
	maxInvestment: number;
	private results$ = new BehaviorSubject<string>('');
	private extraResults$ = new BehaviorSubject<string>('');
	private selectType = SelectType.All;
	private selectedId: string;
	private symbolToView: string;

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

	getSymbolToBuy() {
		return this.symbolToBuy;
	}

	setSymbolToBuy(symbol) {
		this.symbolToBuy = symbol;
		this.providePriceOfSelected();
		return true;
	}

	providePriceOfSelected() {
		this.pollForLatestPrice();
		this.pricePollInterval = setInterval(this.pollForLatestPrice, 5 * 1000);
		return this.selectedPrice$.asObservable();
	}

	pollForLatestPrice() {
		if (!this.symbolToBuy) {
			return;
		}
		this.http.get(`https://api.iextrading.com/1.0/stock/${this.symbolToBuy}/price`)
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
			if (!this.symbolToBuy || !this.maxInvestment) {
				this.logPurchaseInfo({});
				resolve();
			} else {
				const { symbolToBuy: stockSymbol, maxInvestment } = this;
				const url = 'http://localhost:3000/api/v1/purchases'; // process.env.PURCHASES_URL;
				this.http.post(url, { stockSymbol, maxInvestment }).subscribe((res: any) => {
					this.logPurchaseInfo(res.data);
					resolve();
				}, (err) => {
					// If the API server is up but has lost connection to the IEX API,
					// then the API server returns data and message.
					const { data = {}, message = '' } = err.error;
					const msg = message ? message.split('\n') : navigator.onLine ?
						[`Our API server may be down.`] :
						[`Check your internet connection?`];
					this.logPurchaseInfo(data, msg);
					resolve();
				})
			}
		});
	}

	logPurchaseInfo(data, other = []) {
		const topMessage = data.id ? `Purchase completed sucessfully . . .`
			: `Purchase attempt failed harmlessly . . .`;
		this.results$.next([
			topMessage,
			...this.formatEntry(data),
			...other
		].join('\n') + '\n\n' + this.results$.value);
	}

	formatEntry(purchaseEntry: DbPurchase) {
		const { time, symbol, max_4_dec, price_4_dec, num_shares, id } = purchaseEntry;
		const when = new Date(time || Date.now()).toString().split(' (')[0];
		const stockSymbol = symbol || 'Unknown';
		const maxInv = max_4_dec ?
			'$' + (max_4_dec / (10 ** 4)).toFixed(2)
			: 'Unknown';
		const priceWithDecimalPoint = (price_4_dec || 0) / (10 ** 4);
		const price = price_4_dec ?
			'$' + priceWithDecimalPoint.toFixed(4)
			: 'Unknown';
		const numShares = num_shares || 0;
		const total = '$' + (priceWithDecimalPoint * numShares).toFixed(2);
		const purchaseId = id || 'None';
		return [
			when,
			`Stock Symbol: ${stockSymbol}`,
			`Maximum Investment: ${maxInv}`,
			`Price per share: ${price}`,
			`Number of shares purchased: ${numShares}`,
			`Total investment: ${total}`,
			`Purchase ID: ${purchaseId}`
		];
	} 

	get() {
		this.extraResults$.next(''); // clear it
		return new Promise((resolve) => {
			const url = 'http://localhost:3000/api/v1/purchases'; // process.env.PURCHASES_URL;
			const id = this.selectType === SelectType.ById ? `/${this.selectedId}` : '';
			const query = this.selectType === SelectType.BySymbol ? 
				`?symbol=${this.symbolToView}` : '';
			return this.http.get(url + id + query).subscribe((res: any) => {
				const objects = id ? [res] : res;
				this.logExtraInfo(true, objects.reduce((lines, object) =>
					lines.concat(this.formatEntry(object), ['']), []));
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
			topMessage,
			'',
			...messages
		].join('\n') + '\n\n' + this.extraResults$.value);
	}

	setSelectType(type: SelectType) {
		this.selectType = type;
	}

	setSelectedId(id: string) {
		this.selectedId = id;
	}

	setSymbolToView(symbol: string) {
		this.symbolToView = symbol;
	}
}
