import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BreakpointService {

	readonly isMobile$: Observable<boolean>;

	constructor(private breakpointObserver: BreakpointObserver) {
		this.isMobile$ = this.breakpointObserver
			.observe([Breakpoints.Handset])
			.pipe(
				map(result => result.matches),
				shareReplay()
			);
	}
}
