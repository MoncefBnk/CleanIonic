import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchalbumPage } from './searchalbum.page';

describe('SearchalbumPage', () => {
  let component: SearchalbumPage;
  let fixture: ComponentFixture<SearchalbumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchalbumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
