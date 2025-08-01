import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	protected baseUrl: string;

	constructor(
		protected readonly httpClient: HttpClient,
	) {
		const host = window.location.hostname;
		this.baseUrl = `http://${host}/api`
	}
}
