import { Component } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
	selector: 'pi-lot-root',
	imports: [ToolbarComponent, SidenavComponent],
	template: `
		<div class="app-wrapper">
			<pi-lot-toolbar></pi-lot-toolbar>

			<div class="container">
				<pi-lot-sidenav></pi-lot-sidenav>
			</div>
		</div>
	`,
	styles: `
		.app-wrapper {
			display: flex;
			flex-direction: column;
			height: 100vh;
		}

		.container {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			overflow: auto;
		}
	`,
	standalone: true
})
export class AppComponent {
}
