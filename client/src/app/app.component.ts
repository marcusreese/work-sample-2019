import { Component } from '@angular/core';
import { StockService } from './stock.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(public stockService: StockService) {}
}
