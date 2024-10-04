import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapColombiaComponent } from './map-colombia.component';

describe('MapColombiaComponent', () => {
  let component: MapColombiaComponent;
  let fixture: ComponentFixture<MapColombiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapColombiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapColombiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
