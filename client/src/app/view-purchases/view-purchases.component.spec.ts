import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchasesComponent } from './view-purchases.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ViewPurchasesComponent', () => {
  let component: ViewPurchasesComponent;
  let fixture: ComponentFixture<ViewPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPurchasesComponent ],
	  imports: [
		  BrowserModule,
		  HttpClientModule,
		  FormsModule,
		  ReactiveFormsModule,
		  MatTabsModule,
		  MatFormFieldModule,
		  MatInputModule,
		  NoopAnimationsModule
	  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
