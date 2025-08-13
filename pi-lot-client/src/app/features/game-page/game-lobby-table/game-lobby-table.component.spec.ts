import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLobbyTableComponent } from './game-lobby-table.component';

describe('GameLobbyTableComponent', () => {
  let component: GameLobbyTableComponent;
  let fixture: ComponentFixture<GameLobbyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLobbyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLobbyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
