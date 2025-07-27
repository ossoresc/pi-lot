import { Component, inject } from '@angular/core';
import { GameMenuCardComponent } from './game-menu-card/game-menu-card.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameLobbyDialogComponent, GameLobbyDialogData } from './game-lobby-dialog/game-lobby-dialog.component';
import { GameId } from '@pi-lot-interfaces/src/models/game.model';

@Component({
	selector: 'pi-lot-game-page',
	imports: [
		GameMenuCardComponent
	],
	template: `
		<pi-lot-game-menu-card [title]="'Quiz Show'"
							   [subTitle]="'2 - x Player'"
							   [icon]="'question_mark'"
							   [description]="'Compete against each other by answering common knowledge questions'"
							   (onStart)="onQuizShowStart()">
		</pi-lot-game-menu-card>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			height: 100%;
			flex-direction: column;
			margin: 1rem;
		}
	`
})
export class GamePageComponent {

	private readonly router = inject(Router);
	private readonly dialog = inject(MatDialog);

	onQuizShowStart() {
		const dialogRef = this.dialog.open<GameLobbyDialogComponent, GameLobbyDialogData>(GameLobbyDialogComponent, {
			data: {
				gameId: GameId.QUIZSHOW
			}
		});
	}
}
