import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriasActivasComponent } from './convocatorias-activas.component';

describe('ConvocatoriasActivasComponent', () => {
  let component: ConvocatoriasActivasComponent;
  let fixture: ComponentFixture<ConvocatoriasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriasActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
