import { AfterViewInit, Component, signal, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { SidenavService } from '../../services/sidenav.service';
import { interval } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiUtilService } from '../../services/api/api-util.service';

@Component({
	selector: 'pi-lot-sidenav',
	imports: [
		MatSidenavModule,
		MatListModule,
		RouterModule,
		MatIconModule,
		MatLineModule,
		MatTooltipModule
	],
	template: `
		<mat-sidenav-container class="sidenav-container">
			<mat-sidenav #sidenav mode="push" class="sidenav" [autoFocus]="false">
				<mat-nav-list class="nav-list">
					<mat-list-item [routerLink]="'/home'" routerLinkActive="active" (click)="onItemClick()">
						<mat-icon matListItemIcon>home</mat-icon>
						<span mat-line>Home</span>
					</mat-list-item>

					<mat-list-item [routerLink]="'/todo'" routerLinkActive="active" (click)="onItemClick()">
						<mat-icon matListItemIcon>format_list_bulleted</mat-icon>
						<span mat-line>Todos</span>
					</mat-list-item>

					<mat-list-item [routerLink]="'/games'" routerLinkActive="active" (click)="onItemClick()">
						<mat-icon matListItemIcon>games</mat-icon>
						<span mat-line>Games</span>
					</mat-list-item>

					<div class="spacer"></div>

					<mat-list-item [routerLink]="'/state'" routerLinkActive="active" (click)="onItemClick()">
						<mat-icon matListItemIcon>data_object</mat-icon>
						<span mat-line>State</span>
					</mat-list-item>

					<div class="status-footer">
						<mat-icon [matTooltip]="connectedToServer() ? 'Connected' : 'Disconnected'">
							{{ connectedToServer() ? "signal_cellular_alt" : "signal_cellular_off" }}
						</mat-icon>
					</div>
				</mat-nav-list>
			</mat-sidenav>

			<mat-sidenav-content>
				<!-- Main content area -->
				<div #pageContent class="content">
					<router-outlet></router-outlet>
				</div>
			</mat-sidenav-content>
		</mat-sidenav-container>
	`,
	standalone: true,
	styles: `
		:host {
			height: 100%;
		}

		.sidenav-container {
			height: 100%;
			display: flex;
			flex-direction: column;

			.content {
				overflow-y: auto;
				height: 100%;
				box-sizing: border-box;
				background-color: var(--mat-sys-surface-container);
			}

			.sidenav {

				.nav-list {
					display: flex;
					flex-direction: column;
					box-sizing: border-box;
					padding: 0.5rem;
					height: 100%;

					.active {
						background-color: var(--mat-sys-secondary-container);
					}

					.status-footer {
						display: flex;
						flex-direction: row;
						justify-content: flex-end;
					}
				}
			}
		}
	`
})
export class SidenavComponent implements AfterViewInit {
	@ViewChild('sidenav') sidenav!: MatSidenav;

	constructor(
		private readonly sidenavService: SidenavService,
		private readonly apiUtilService: ApiUtilService,
	) {
	}

	connectedToServer = signal(false);

	ngAfterViewInit() {
		this.sidenavService.setSidenav(this.sidenav);

		// TODO: handle interval here? bad practice
		interval(5000).subscribe(() => {
			this.apiUtilService.ping().subscribe(res => {
				this.connectedToServer.set(res);
			})
		})
	}

	onItemClick() {
		this.sidenavService.toggle();
	}
}
