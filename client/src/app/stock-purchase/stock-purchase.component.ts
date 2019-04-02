import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StockService } from '../stock.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-stock-purchase',
	templateUrl: './stock-purchase.component.html',
	styleUrls: ['./stock-purchase.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPurchaseComponent implements OnInit {
	maxShares$: Observable<number>;
	constructor(private stockService: StockService) { }

	ngOnInit() {
	}

	estimate(event) {
		this.maxShares$ = this.stockService.updateEstimate(event.target.value);
	}
}
