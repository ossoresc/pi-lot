import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GameTypeId } from '@pi-lot-interfaces/src/models/game.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface GameLobby {
	id: number;
	name: string;
	type: GameTypeId;
	player: number;
	maxPlayer: number;
}

const GAME_LOBBIES: GameLobby[] = [
	{id: 0, name: "testname", type: GameTypeId.QUIZSHOW, player: 1, maxPlayer: 4},
];

@Component({
  selector: 'pi-lot-game-lobby-table',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  template: `
	  <table mat-table [dataSource]="dataSource" >

		  <ng-container matColumnDef="name">
			  <th mat-header-cell *matHeaderCellDef> Name </th>
			  <td mat-cell *matCellDef="let element"> {{element.name}} </td>
		  </ng-container>

		  <ng-container matColumnDef="type">
			  <th mat-header-cell *matHeaderCellDef> Gametype </th>
			  <td mat-cell *matCellDef="let element"> {{element.type}} </td>
		  </ng-container>

		  <ng-container matColumnDef="player">
			  <th mat-header-cell *matHeaderCellDef> Player </th>
			  <td mat-cell *matCellDef="let element"> {{ element.player }} / {{ element.maxPlayer }} </td>
		  </ng-container>

		  <ng-container matColumnDef="actions">
			  <th mat-header-cell *matHeaderCellDef> Actions </th>
			  <td mat-cell *matCellDef="let element">
				  <button mat-raised-button>Join</button>
			  </td>
		  </ng-container>

		  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
		  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
	  </table>
  `,
  styles: `
  `
})
export class GameLobbyTableComponent {
	displayedColumns: string[] = ['name', 'type', 'player', 'actions'];
	dataSource = new MatTableDataSource<GameLobby>(GAME_LOBBIES);

	// TODO: cookies for multiple joins by same user
}
