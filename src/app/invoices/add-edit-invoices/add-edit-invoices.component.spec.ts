import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInvoicesComponent } from './add-edit-invoices.component';

describe('AddEditInvoicesComponent', () => {
  let component: AddEditInvoicesComponent;
  let fixture: ComponentFixture<AddEditInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
