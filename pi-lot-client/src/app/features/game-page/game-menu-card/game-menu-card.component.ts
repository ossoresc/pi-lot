import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'pi-lot-game-menu-card',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule
	],
	template: `
		<mat-card>
			<mat-card-header>
				<div class="icon-avatar" mat-card-avatar>
					<mat-icon>{{ icon }}</mat-icon>
				</div>
				<mat-card-title>{{ title }}</mat-card-title>
				<mat-card-subtitle>{{ subTitle }}</mat-card-subtitle>
			</mat-card-header>
			<mat-card-content>
				{{ description }}
			</mat-card-content>
			<mat-card-actions align="end">
				<button [disabled]="disabled" mat-button (click)="onStartClick()">Start</button>
			</mat-card-actions>
		</mat-card>
	`,
	standalone: true,
	styles: `
		mat-card {
			width: 20rem;

			.icon-avatar {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
		}
	`
})
export class GameMenuCardComponent {

	@Input()
	public title!: string;

	@Input()
	public subTitle!: string;

	@Input()
	public icon!: string;

	@Input()
	public description!: string;

	@Input()
	public disabled: boolean = false;

	@Output()
	public onStart = new EventEmitter<void>();

	onStartClick() {
		this.onStart.emit();
	}
}
