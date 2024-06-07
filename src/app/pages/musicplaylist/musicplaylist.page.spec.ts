import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicplaylistPage } from './musicplaylist.page';

describe('MusicplaylistPage', () => {
  let component: MusicplaylistPage;
  let fixture: ComponentFixture<MusicplaylistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicplaylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
