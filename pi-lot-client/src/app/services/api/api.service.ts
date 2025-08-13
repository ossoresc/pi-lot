import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	protected baseUrl: string = environment.baseUrl;

	constructor(
		protected readonly httpClient: HttpClient,
	) {
	}
}
