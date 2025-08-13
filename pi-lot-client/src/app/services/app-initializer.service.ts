import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { loadTodoCategories, loadTodos } from '../state/actions/todo.actions';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

	constructor(private store: Store) {}

	initializeApp(): Observable<any> {
		this.store.dispatch(loadTodos());
		this.store.dispatch(loadTodoCategories());
		return of(true);
	}
}
