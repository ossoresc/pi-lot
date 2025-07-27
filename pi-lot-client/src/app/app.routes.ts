import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { TodoPageComponent } from './features/todo-page/todo-page.component';
import { GamePageComponent } from './features/game-page/game-page.component';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { StatePageComponent } from './features/state-page/state-page.component';
import { GameLobbyComponent } from './features/game-page/game-lobby/game-lobby.component';

export const routes: Routes = [
	{path: "home", component: HomePageComponent, title: "Home"},
	{path: "todo", component: TodoPageComponent, title: "Todos"},
	{path: "games", component: GamePageComponent, title: "Games"},
	{path: "game-lobby", component: GameLobbyComponent, title: "Game Lobby"},
	{path: "state", component: StatePageComponent, title: "State"},
	{path: "login", component: LoginPageComponent, title: "Login"},
	{path: "**", redirectTo: "home"},
];
