import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultsearchPage } from './defaultsearch.page';

describe('DefaultsearchPage', () => {
  let component: DefaultsearchPage;
  let fixture: ComponentFixture<DefaultsearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
