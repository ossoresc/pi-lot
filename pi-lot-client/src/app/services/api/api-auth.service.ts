import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '@pi-lot-interfaces/src/models/user.model';
import { LoginData } from '@pi-lot-interfaces/src/models/login-data.model';

@Injectable({
	providedIn: 'root'
})
export class ApiAuthService extends ApiService {

	login(loginData: LoginData): Observable<User | undefined> {
		return this.httpClient.post<User | undefined>(this.baseUrl + "/auth/login", loginData);
	}
}
