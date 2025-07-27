import { Component } from '@angular/core';

@Component({
	selector: 'pi-lot-home-page',
	imports: [],
	template: `
		<div class="info-container">
			<h1>Info</h1>
			<p>This is an ongoing test project for an Angular client and NodeJS server.</p>
			<p>It aims to be deployed on a raspberry pi. Maybe some simple games will be
				released, which then can be played with multiple people via websockets.</p>
			<p>The main focus currently is to test architecture, state management, client server communication and
				persistence.</p>

			<h2>Angular client</h2>
			<p>The client is built with Angular 20 and Angular Material.</p>

			<h2>NodeJS server</h2>
			<p>The server is built with express, tsoa, swagger-ui-express and winston for logging. It utilizes a
				sqlite database.</p>

			<h2>Things to consider</h2>
			<p>Since this is a test project there are basically no tests at all and many features are incomplete.
				The main purpose of this project is to achieve proof of concept of different technologies and packages.
				This is definitely not production ready and should not be used. For example the login feature is unsafe
				as it can possibly be.</p>
		</div>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			align-items: center;
		}

		.info-container {
			max-width: 80rem;
		}
	`
})
export class HomePageComponent {


}
