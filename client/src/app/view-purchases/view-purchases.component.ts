import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-view-purchases',
  templateUrl: './view-purchases.component.html',
  styleUrls: ['./view-purchases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPurchasesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
