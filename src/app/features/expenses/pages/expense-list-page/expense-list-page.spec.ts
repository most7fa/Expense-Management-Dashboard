import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListPage } from './expense-list-page';

describe('ExpenseListPage', () => {
  let component: ExpenseListPage;
  let fixture: ComponentFixture<ExpenseListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
