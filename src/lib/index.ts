import { m } from './paraglide/messages';
import type { CountdownType, LanguageType, TimezoneType } from './types';

export const writeDays = (days: number, locale: string) => {
	if (days == 0) return m.day0({}, { locale: locale as LanguageType });
	else if (days == 1) return m.day1({}, { locale: locale as LanguageType });
	else if (days <= 4) return m.day234({}, { locale: locale as LanguageType });
	else return m.dayP({}, { locale: locale as LanguageType });
};

export const writeMinutes = (minutes: number, locale: string) => {
	if (minutes == 0) return m.minute0({}, { locale: locale as LanguageType });
	else if (minutes == 1) return m.minute1({}, { locale: locale as LanguageType });
	else if (minutes <= 4) return m.minute234({}, { locale: locale as LanguageType });
	else return m.minuteP({}, { locale: locale as LanguageType });
};

export const writeSeconds = (seconds: number, locale: string) => {
	if (seconds == 0) return m.second0({}, { locale: locale as LanguageType });
	else if (seconds == 1) return m.second1({}, { locale: locale as LanguageType });
	else if (seconds <= 4) return m.second234({}, { locale: locale as LanguageType });
	else return m.secondP({}, { locale: locale as LanguageType });
};

export const writeHours = (hours: number, locale: string) => {
	if (hours == 0) return m.hour0({}, { locale: locale as LanguageType });
	else if (hours == 1) return m.hour1({}, { locale: locale as LanguageType });
	else if (hours <= 4) return m.hour234({}, { locale: locale as LanguageType });
	else return m.hourP({}, { locale: locale as LanguageType });
};

export const writeMilliseconds = (milliseconds: number, locale: string) => {
	if (milliseconds == 0) return m.millisecond0({}, { locale: locale as LanguageType });
	else if (milliseconds == 1) return m.millisecond1({}, { locale: locale as LanguageType });
	else if (milliseconds <= 4) return m.millisecond234({}, { locale: locale as LanguageType });
	else return m.millisecondP({}, { locale: locale as LanguageType });
};

export const makeTimezone = (
	hour: number,
	cities: string[],
	otherCities: string[]
): TimezoneType => {
	return {
		hour,
		cities,
		otherCities
	};
};

//we use time during new year's
//https://time.is/tpi/time_zones
export const timezoneList: TimezoneType[] = [
	makeTimezone(-12, ['Baker and Howland Islands'], []),
	makeTimezone(-11, ['Samoa'], ['Niue']),
	makeTimezone(-10, ['Hawaii'], ['Cook Islands', 'Papeete (PyF.)']),
	makeTimezone(-9.5, ['Atuona (PyF.)'], []),
	makeTimezone(-9, ['Anchorage'], ['Rikitea (PyF.)']),
	makeTimezone(
		-8,
		['San Francisco', 'Vancouver', 'Los Angeles'],
		['Seattle', 'San Diego', 'Pitcairn Islands']
	),
	makeTimezone(-7, ['Edmonton', 'Albuquerque'], ['Denver', 'Ciudad Juárez', 'Phoenix']),
	makeTimezone(
		-6,
		['Manitoba', 'Nashville', 'Mexico City', 'Chicago', 'San Salvador'],
		['Oklahoma City', 'San Jose', 'Kansas City', 'Minneapolis', 'Winnipeg', 'Memphis', 'Austin']
	),
	makeTimezone(
		-5,
		['Ottawa', 'Bogotá', 'Toronto', 'Quito', 'New York', 'Washington D.C.'],
		['Cancún', 'Pittsburgh', 'Philadephia', 'Kingston', 'Montreal', 'Havana']
	),
	makeTimezone(-4, ['La Paz', 'Caracas'], ['Halifax', 'Santo Domingo']), //la paz is not the capital of bolivia! sucre is!
	makeTimezone(-3.5, ["St. John's"], []),
	makeTimezone(
		-3,
		['Rio de Janeiro', 'Buenos Aires', 'São Paulo', 'Santiago', 'Montevideo'],
		['Cordóba', 'Stanley (Falklands)', 'Porto Alegre', 'Natal', 'Cayenne']
	),
	makeTimezone(-2, ['Nuuk'], []),
	makeTimezone(-1, ['Azores', 'Cape Verde'], []),
	makeTimezone(
		0,
		['Lisbon', 'London', 'Dublin'],
		[
			'Manchester',
			'Sheffield',
			'Liverpool',
			'Edinburgh',
			'Glasgow',
			'Bristol',
			'Birmingham',
			'Porto',
			'Monrovia'
		]
	),
	// :)
	makeTimezone(
		1,
		[
			'Weißwasser',
			'Tirana',
			'Wien',
			'Brussel',
			'Sarajevo',
			'Brazzaville',
			'Zagreb',
			'Praha',
			'København',
			'Paris',
			'Berlin',
			'Warszawa',
			'Budapest',
			'Roma',
			'Casablanca',
			'Amsterdam',
			'Lagos',
			'Skopje',
			'Oslo',
			'Beograd',
			'Bratislava',
			'Ljubljana',
			'Madrid',
			'Stockholm',
			'Zurich',
			'Bern'
		],
		[
			'Città del Vaticano',
			'Gothenburg',
			'Barcelona',
			'Seville',
			'Zaragoza',
			'Maribor',
			'Košice',
			'Niš',
			'Bergen',
			'Ústí nad Labem',
			'Rotterdam',
			'Den Haag',
			'Rabat',
			'Milano',
			'Napoli',
			'Pristina',
			'Vaduz',
			'Debrecen',
			'Antwerpen',
			'Graz',
			'Durrës',
			'Split',
			'Brno',
			'Aarhus',
			'Marseille',
			'Toulouse',
			'Nice',
			'Lyon',
			'Frankfurt am Main',
			'München',
			'Kraków',
			'Łódż',
			'Wrocław',
			'Katowice',
			'Gdańsk'
		]
	),
	makeTimezone(
		2,
		[
			'Kyiv',
			'Bucharest',
			'Talinn',
			'Riga',
			'Vilnius',
			'Kaunas',
			'Chisinau',
			'Jerusalem',
			'Sofia',
			'Helsinki',
			'Espoo',
			'Athens'
		],
		[
			'Thessaloniki',
			'Kaliningrad',
			'Nicosia',
			'Plovdiv',
			'Tartu',
			'Tel Aviv',
			'Gaza',
			'Tiraspol',
			'Iasi',
			'Dnipro',
			'Kharkiv',
			'Daugavpils'
		]
	),
	makeTimezone(
		3,
		['Djibouti', 'Baghdad', 'Moscow', 'Mecca', 'Riyadh', 'Medina', 'Mogadishu', 'Damascus'],
		[
			'Donetsk',
			'Luhansk',
			'Basra',
			'Kazan',
			'Nizhny Novgorod',
			'Aleppo',
			'Rostov-on-Don',
			'Dar es Salaam'
		]
	),
	makeTimezone(3.14, ['Π'], ['τ>π']),
	makeTimezone(3.5, ['Tehran'], ['Mashhad']),
	makeTimezone(
		4,
		['Tbilisi', 'Baku', 'Dubai'],
		['Yerevan', 'Samara', 'Tolyatti', 'Abu Dhabi', 'Muscat']
	),
	makeTimezone(4.5, ['Kabul'], ['Kandahar', 'Mazari Sharif']),
	//2 hyderabads... India and Pakistan (they love each other)
	makeTimezone(
		5,
		['Almaty', 'Islamabad', 'Tashkent'],
		['Astana', 'Faisalabad', 'Hyderabad', 'Chelyabinsk', 'Yekaterinburg', 'Namangan']
	),
	//sri lanka colombo
	makeTimezone(5.5, ['New Delhi', 'Colombo'], ['Hyderabad', 'Mumbai', 'Kolkata', 'Ahmedabad']),
	makeTimezone(5.75, ['Kathmandu'], ['Biratnagar']),
	makeTimezone(6, ['Dhaka', 'Omsk'], ['Chittagong', 'Thimphu', 'Bishkek']),
	makeTimezone(6.5, ['Naypyidaw'], ['Yangon']),
	makeTimezone(
		7,
		['Jakarta', 'Pakse', 'Khovd', 'Krasnoyarsk', 'Novosibirsk', 'Bangkok', 'Ho Chi Minh City'],
		['Surabaya', 'Udon Thani', 'Haiphong', 'Hanoi', 'Huế']
	),
	makeTimezone(
		8,
		['Beijing', 'Taipei', 'Shanghai', 'Kuala Lumpur', 'Ulanbataar', 'Manila'],
		['Irkutsk', 'Perth', 'Chongqing', 'Dongguan', 'Chengdu', 'Nanjing', 'Wuhan', 'Tianjin', 'Klang']
	),
	makeTimezone(8.75, ['Eucla'], []),
	makeTimezone(
		9,
		['Pyongyang', 'Seoul', 'Tokyo'],
		['Chita', 'Osaka', 'Yakutsk', 'Yokohama', 'Hiroshima', 'Nagasaki']
	),
	makeTimezone(9.5, ['Darwin'], []),
	makeTimezone(
		10,
		['Vladivostok', 'Brisbane', 'Port Moresby'],
		['Khabarovsk', 'Gold Coast', 'Lae']
	),
	makeTimezone(10.5, ['Adelaide'], []),
	makeTimezone(11, ['Canberra', 'Sydney', 'ACT'], ['Hobart', 'Yuzhno-Sakhalinsk']),
	makeTimezone(12, ['Kiribati', 'Tuvalu'], ['Petropavlovsk-Kamchatsky']),
	makeTimezone(13, ['Phoenix Islands (Kiri.)'], []),
	makeTimezone(13.75, ['Chatham Islands (NZ.)'], []),
	makeTimezone(14, ['Tabwakea Village (Kiri.)'], [])
].sort((a, b) => b.hour - a.hour);

export const makeCountdown = (target: Date, now: Date): CountdownType => {
	return {
		days: Math.round(Math.trunc((target.getTime() - now.getTime()) / 1000 / 60 / 60 / 24)),
		hours: Math.round(Math.trunc((target.getTime() - now.getTime()) / 1000 / 60 / 60) % 24),
		minutes: Math.round(Math.trunc((target.getTime() - now.getTime()) / 1000 / 60) % 60),
		seconds: Math.round(Math.trunc((target.getTime() - now.getTime()) / 1000) % 60),
		milliseconds: Math.round((target.getTime() - now.getTime()) % 1000),
		total: target.getTime() - now.getTime()
	};
};

//for canvas
export const timezonePointList = [

];