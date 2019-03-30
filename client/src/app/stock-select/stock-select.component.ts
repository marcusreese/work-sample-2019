import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take, delay, tap } from 'rxjs/operators';
import { StockService } from '../stock.service';

@Component({
	selector: 'app-stock-select',
	templateUrl: './stock-select.component.html',
	styleUrls: ['./stock-select.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockSelectComponent implements OnInit {
	myControl = new FormControl();
	filteredOptions: Observable<string[]>;
	indexedStocks: any = {};
	chosenStock = {};

	constructor(private stockService: StockService) {}

	ngOnInit() {
		this.stockService.fetchRefData().pipe(take(1)).subscribe((stocks: any) => {
			this.indexedStocks = stocks;
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
		if (!val) {
			this.chosenStock = {};
			return;
		} else if (!this.indexedStocks[val] || this.indexedStocks[val].full[0].symbol !== val) {
			this.chosenStock = { name: '(Invalid symbol)'};
		} else {
			this.chosenStock = this.indexedStocks[val].full[0];
		}
	}
}
