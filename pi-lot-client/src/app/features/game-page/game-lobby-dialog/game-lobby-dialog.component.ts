import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GameTypeId } from '@pi-lot-interfaces/src/models/game.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface GameLobbyDialogData {
	gameId: GameTypeId;
}

@Component({
	selector: 'pi-lot-game-lobby-dialog',
	imports: [
		MatDialogModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule
	],
	template: `
		<h2 mat-dialog-title>Create lobby for: {{ getGameName() }}</h2>

		<mat-dialog-content>
			<form>
				<mat-form-field>
					<mat-label>Enter game title</mat-label>
					<input matInput/>
				</mat-form-field>


			</form>
		</mat-dialog-content>

		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-button>Create</button>
		</mat-dialog-actions>
	`,
	styles: ``
})
export class GameLobbyDialogComponent {
	dialogData: GameLobbyDialogData = inject(MAT_DIALOG_DATA);

	getGameName() {
		switch (this.dialogData.gameId) {
			case GameTypeId.QUIZSHOW:
				return "Quiz Show";
		}
	}
}
