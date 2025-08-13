import { Component, Input } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'pi-lot-state-viewer',
	imports: [
		NgForOf,
		NgIf,
		MatButtonModule,
		MatIconModule,
		JsonPipe
	],
	template: `
		<div class="state-values">
			<div class="state-value-object" *ngIf="isObject(value)">
				<button mat-icon-button (click)="toggle()">
					<mat-icon>{{ isCollapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down' }}</mat-icon>
				</button>

				<span>
					<strong>{{ key }}</strong> ({{ getType(value) }})
				</span>
			</div>

			<div class="state-value-primitive" *ngIf="!isObject(value)">
				<span><strong>{{ key }}</strong></span>
				<span><em>({{ getType(value) }}) </em>: </span>
				<div class="spacer"></div>
				<span *ngIf="getType(value)">{{ value | json }}</span>
			</div>
		</div>

		<div class="nested" *ngIf="isObject(value) && !isCollapsed">
			<ng-container *ngFor="let key of getKeys(value)">
				<div class="nested-row">
					<pi-lot-state-viewer
						[key]="key"
						[value]="value[key]"
						[isCollapsed]="isCollapsed"
						[level]="level + 1">
					</pi-lot-state-viewer>
				</div>
			</ng-container>

			<span *ngIf="getKeys(value).length == 0">Empty</span>
		</div>
	`,
	standalone: true,
	styles: `
		:host {
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			max-height: 100%;
			max-width: 100%;
			overflow: auto;
			padding-right: 0.2rem;
		}

		.state-values {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			gap: 0.25rem;
			padding: 0.25rem;

			.state-value-object {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.state-value-primitive {
				margin-left: 2.75rem;
				padding-bottom: 0.2rem;
				display: flex;
				flex-direction: row;
				flex: 1 1 auto;
				gap: 0.5rem;

				border-bottom: 0.1rem dashed var(--mat-sys-on-secondary-container);
			}
		}

		.nested {
			display: flex;
			flex-direction: column;
			margin-left: 1.35rem;
			padding-left: 1rem;
			border-left: 0.15rem dotted var(--mat-sys-on-secondary-container);

			.nested-row {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
			}
		}
	`
})
export class StateViewerComponent {
	@Input() key: string = '';
	@Input() value: any;
	@Input() level: number = 0;

	isObject(val: any): boolean {
		return val !== null && typeof val === 'object';
	}

	@Input()
	isCollapsed = true;

	toggle(): void {
		this.isCollapsed = !this.isCollapsed;
	}

	getType(value: any): string {
		return Array.isArray(value) ? 'array' : typeof value;
	}

	getKeys(obj: object): string[] {
		return Object.keys(obj);
	}
}
