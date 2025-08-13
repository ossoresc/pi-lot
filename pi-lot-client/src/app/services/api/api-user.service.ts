import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserDto } from '@pi-lot-interfaces/src/dtos/user.dto';

@Injectable({
	providedIn: 'root'
})
export class UserService extends ApiService {

	getAll() {
		return this.httpClient.get<UserDto[]>(`${this.baseUrl}/user/getAll`);
	}

	getById(id: number) {
		return this.httpClient.get<UserDto | null>(`${this.baseUrl}/user/getById/${id}`);
	}

	update(id: number, user: UserDto) {
		return this.httpClient.put(`${this.baseUrl}/user/update/${id}`, user);
	}

	delete(id: number) {
		return this.httpClient.delete(`${this.baseUrl}/user/delete/${id}`);
	}
}
