import { Component } from '@angular/core';
import { StockService } from './stock.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	resultsArrived = false;
	results$: Observable<any>;
	extraResultsArrived = false;
	extraResults$: Observable<any>;

	constructor(public stockService: StockService) {
		this.results$ = this.stockService.getResults$();
	}

	attemptPurchase() {
		this.resultsArrived = false;
		this.stockService.buy().then(() => {
			this.resultsArrived = true;
		});
	}
	
	getAll() {
		console.log('ready')
		this.extraResultsArrived = false;
		this.stockService.buy().then(() => {
			this.extraResultsArrived = true;
		});
	}
}
