import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavService } from '../../services/sidenav.service';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatMenuModule } from '@angular/material/menu';
import { Title } from '@angular/platform-browser';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
	selector: 'pi-lot-toolbar',
	imports: [
		MatToolbarModule,
		MatTooltipModule,
		RouterLink,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		UserMenuComponent
	],
	template: `
		<mat-toolbar class="toolbar">
			<button #menuButton mat-icon-button (click)="onMenuClick()">
				<mat-icon>menu</mat-icon>
			</button>

			<div class="toolbar-header">
				<button mat-button routerLink="/home">
					Pi-Lot
				</button>

				<span class="toolbar-title">{{ title.getTitle() }}</span>
			</div>


			<div class="spacer"></div>

			<pi-lot-user-menu></pi-lot-user-menu>
		</mat-toolbar>
	`,
	standalone: true,
	styles: `
		.toolbar {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			background: var(--mat-sys-secondary-container);

			.toolbar-header {
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				gap: 1rem;

				.toolbar-title {
					font-size: 1rem;
				}
			}
		}
	`
})
export class ToolbarComponent implements AfterViewInit {

	@ViewChild("menuButton") menuButton!: MatButton;

	private readonly sidenavService = inject(SidenavService);
	private readonly focusMonitor = inject(FocusMonitor);

	protected readonly title = inject(Title);

	ngAfterViewInit() {
		this.focusMonitor.stopMonitoring(this.menuButton._elementRef);
	}

	onMenuClick() {
		this.sidenavService.toggle();
	}
}
