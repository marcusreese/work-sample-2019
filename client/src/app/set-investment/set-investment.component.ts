import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StockService } from '../stock.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-set-investment',
	templateUrl: './set-investment.component.html',
	styleUrls: ['./set-investment.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetInvestmentComponent implements OnInit {
	maxShares$: Observable<number>;
	constructor(private stockService: StockService) { }

	ngOnInit() {
	}

	estimate(event) {
		this.maxShares$ = this.stockService.updateEstimate(Number(event.target.value));
	}
}
