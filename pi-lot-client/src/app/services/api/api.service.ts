import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	// TODO: move baseUrl to config
	protected baseUrl = 'http://localhost:3000';

	constructor(
		protected readonly httpClient: HttpClient,
	) {
	}
}
