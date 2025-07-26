import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormularioValidacionComponent } from './card-formulario-validacion.component';

describe('CardFormularioValidacionComponent', () => {
  let component: CardFormularioValidacionComponent;
  let fixture: ComponentFixture<CardFormularioValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFormularioValidacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardFormularioValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
