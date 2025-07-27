import { MatDateFormats } from '@angular/material/core';

export const PI_LOT_DATE_FORMATS: MatDateFormats = {
	parse: {
		dateInput: 'EEE, dd.MM.yyyy',
	},
	display: {
		dateInput: 'EEE, dd.MM.yyyy',
		monthYearLabel: 'MMM yyyy',
		dateA11yLabel: 'fullDate',
		monthYearA11yLabel: 'MMMM yyyy',
	},
}
