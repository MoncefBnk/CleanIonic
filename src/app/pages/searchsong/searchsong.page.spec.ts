import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchsongPage } from './searchsong.page';

describe('SearchsongPage', () => {
  let component: SearchsongPage;
  let fixture: ComponentFixture<SearchsongPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
