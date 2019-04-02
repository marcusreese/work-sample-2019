import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-stock-purchase',
	templateUrl: './stock-purchase.component.html',
	styleUrls: ['./stock-purchase.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPurchaseComponent implements OnInit {
	maxAmount: number;
	constructor() { }

	ngOnInit() {
	}

}
