import { FormControl } from '@angular/forms';

export interface LoginDataFormGroup {
	username: FormControl<string>;
	password: FormControl<string>;
}
