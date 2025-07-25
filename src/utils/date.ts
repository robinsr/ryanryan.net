const fmtLongConfig: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
}

const fmtShortConfig: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric'
}

export function formatDate(date: Date | string): string {
	

	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {
		return new Intl.DateTimeFormat('en-US', fmtLongConfig).format(date);
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
}

export function formatDateShort(date: Date | string): string {

	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {
		return new Intl.DateTimeFormat('en-US', fmtShortConfig).format(date);
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
}

export function formatDateISO(date: Date | string): string {

	if (typeof date === 'string') {
		date = new Date(date);
	}

	try {	
		return date.toISOString().split('T')[0];
	} catch (error) {
		console.error(error);
		return 'Invalid date ' + date;
	}
} 