import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchartistPage } from './searchartist.page';

describe('SearchartistPage', () => {
  let component: SearchartistPage;
  let fixture: ComponentFixture<SearchartistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchartistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
