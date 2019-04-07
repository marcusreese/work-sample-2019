import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StockService, SelectType } from '../stock.service';

const tabIdxToSelectType = {
	0: SelectType.All,
	1: SelectType.ById,
	2: SelectType.BySymbol
};

@Component({
	selector: 'app-view-purchases',
	templateUrl: './view-purchases.component.html',
	styleUrls: ['./view-purchases.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPurchasesComponent implements OnInit {

	constructor(private stockService: StockService) { }

	ngOnInit() {
	}

	tabClick(index) {
		this.stockService.setSelectType(tabIdxToSelectType[index]);
	}

	setId(id) {
		this.stockService.setSelectedId(id);
	}
}
