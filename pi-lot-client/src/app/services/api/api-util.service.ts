import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Ping } from '@pi-lot-interfaces/src/models/ping.model';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class ApiUtilService extends ApiService {

	ping(): Observable<boolean> {
		return this.httpClient.get<Ping>(this.baseUrl + "/util/ping").pipe(
			map(res => res.message === "Pong"),
			catchError(error => {
				return of(false);
			})
		);
	}

}
