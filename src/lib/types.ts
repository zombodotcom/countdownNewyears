export type LanguageType = 'en' | 'cs' | 'ru' | 'de' | 'pl' | 'hu' | 'fr' | 'es' | 'ua';

export type TimezoneType = {
	hour: number;
	cities: string[]; //important cities, regions (bold)
	otherCities: string[]; //not so important
};

export type CountdownType = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
	total: number;
};

export type PointType = {
	x: number;
	y: number;
};