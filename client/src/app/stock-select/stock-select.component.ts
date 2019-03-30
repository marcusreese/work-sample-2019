import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-stock-select',
	templateUrl: './stock-select.component.html',
	styleUrls: ['./stock-select.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockSelectComponent implements OnInit {
	myControl = new FormControl();
	filteredOptions: Observable<string[]>;
	indexedSymbols: string[];
	indexedStocks: any = {};
	chosenStock = {};

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.http.get('https://api.iextrading.com/1.0/ref-data/symbols')
		.pipe(take(1))
		.subscribe((stocks: any[]) => {
			this.indexedStocks = stocks.reduce((obj, next) => {
				const name = next.symbol;
				Array(8).fill(true).forEach((v, n) => {
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
			}, {});

			this.filteredOptions = this.myControl.valueChanges.pipe(
				startWith(''),
				map(value => this._filter(value.toUpperCase()))
			);
		});
	}

	private _filter(value: string): string[] {
		const found = this.indexedStocks[value];
		return found ? found.symbols : this.indexedStocks['A'].symbols;
	}

	onChange(val: string) {
		console.log('onchange', val, this.indexedStocks[val] ? this.indexedStocks[val].full[0] : 'none');
		if (!val) {
			this.chosenStock = {};
			return;
		} else if (!this.indexedStocks[val] || this.indexedStocks[val].full[0].symbol !== val) {
			this.chosenStock = { name: '(Invalid symbol)'};
		} else {
			console.log('match?:', this.indexedStocks[val].full[0].symbol, val);
			this.chosenStock = this.indexedStocks[val].full[0];
		}
	}
}
