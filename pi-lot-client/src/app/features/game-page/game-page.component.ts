import { Component, inject } from '@angular/core';
import { GameMenuCardComponent } from './game-menu-card/game-menu-card.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameLobbyDialogComponent, GameLobbyDialogData } from './game-lobby-dialog/game-lobby-dialog.component';
import { GameTypeId } from '@pi-lot-interfaces/src/models/game.model';
import { GameLobbyTableComponent } from './game-lobby-table/game-lobby-table.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'pi-lot-game-page',
	imports: [
		GameMenuCardComponent,
		GameLobbyTableComponent,
		MatDividerModule
	],
	template: `
		<div class="games-container">
			<pi-lot-game-menu-card [title]="'Quiz Show'"
								   [subTitle]="'2 - x player'"
								   [icon]="'question_mark'"
								   [description]="'Compete against each other by answering common knowledge questions'"
								   (onStart)="onQuizShowStart()">
			</pi-lot-game-menu-card>
		</div>

		<mat-divider></mat-divider>

		<div class="lobby-container">
			<pi-lot-game-lobby-table></pi-lot-game-lobby-table>
		</div>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			height: 100%;
			flex-direction: column;
			padding: 1rem;
			box-sizing: border-box;
		}

		mat-divider {
			margin: 2rem 0;
		}

		.games-container {
			flex: 0 1 auto;
			display: flex;
			flex-direction: row;
			padding: 1rem;
			gap: 1rem;
			overflow: auto;
			box-sizing: border-box;
		}

		.lobby-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: auto;
		}
	`
})
export class GamePageComponent {

	private readonly router = inject(Router);
	private readonly dialog = inject(MatDialog);

	onQuizShowStart() {
		const dialogRef = this.dialog.open<GameLobbyDialogComponent, GameLobbyDialogData>(GameLobbyDialogComponent, {
			data: {
				gameId: GameTypeId.QUIZSHOW
			}
		});
	}
}
