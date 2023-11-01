import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoRelatorioComponent } from './novo-relatorio.component';

describe('NovoRelatorioComponent', () => {
  let component: NovoRelatorioComponent;
  let fixture: ComponentFixture<NovoRelatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovoRelatorioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
