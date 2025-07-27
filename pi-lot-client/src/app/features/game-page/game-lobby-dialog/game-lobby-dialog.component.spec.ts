import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLobbyDialogComponent } from './game-lobby-dialog.component';

describe('GameLobbyDialogComponent', () => {
  let component: GameLobbyDialogComponent;
  let fixture: ComponentFixture<GameLobbyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLobbyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLobbyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
