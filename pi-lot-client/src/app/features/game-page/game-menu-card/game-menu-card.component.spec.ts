import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuCardComponent } from './game-menu-card.component';

describe('GameMenuCardComponent', () => {
  let component: GameMenuCardComponent;
  let fixture: ComponentFixture<GameMenuCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMenuCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameMenuCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
