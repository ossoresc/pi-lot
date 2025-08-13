import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserDto } from '@pi-lot-interfaces/src/dtos/user.dto';
import { LoginData } from '@pi-lot-interfaces/src/models/login-data.model';

@Injectable({
	providedIn: 'root'
})
export class ApiAuthService extends ApiService {

	login(loginData: LoginData): Observable<UserDto | undefined> {
		return this.httpClient.post<UserDto | undefined>(`${this.baseUrl}/auth/login`, loginData);
	}
}
