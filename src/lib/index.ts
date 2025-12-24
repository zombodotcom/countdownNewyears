import { m } from './paraglide/messages';
import type { CountdownType, LanguageType, PointType, TimezoneType } from './types';
import { error } from '@sveltejs/kit';

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

export const writeUsersOnline = (users: number, locale: string) => {
	if (users == 0) return m.userOnline0({}, { locale: locale as LanguageType });
	else if (users == 1) return m.userOnline1({}, { locale: locale as LanguageType });
	else if (users <= 4) return m.userOnline234({}, { locale: locale as LanguageType });
	else return m.userOnlineP({}, { locale: locale as LanguageType });
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
	//2 hyderabads... India (+5.5) and Pakistan (+5) (they love each other)
	makeTimezone(
		5,
		['Almaty', 'Islamabad', 'Tashkent'],
		['Astana', 'Faisalabad', 'Hyderabad', 'Chelyabinsk', 'Yekaterinburg', 'Namangan']
	),
	//sri lanka colombo and india
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

export const makeTimezonePoint = (x: number, y: number): PointType => {
	return { x: x, y: y };
};

//for canvas
//IMPORTANT: width should be 4 1/6, is 4 tho
//we fix by making some 5 wide i guess
export const timezonePointList = [
	//-12
	[
		makeTimezonePoint(0, 0),
		makeTimezonePoint(0, 8),
		makeTimezonePoint(2, 10),
		makeTimezonePoint(2, 15),
		makeTimezonePoint(0, 17),
		makeTimezonePoint(0, 50),
		makeTimezonePoint(2, 50),
		makeTimezonePoint(2, 46),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(2, 54),
		makeTimezonePoint(2, 85),
		makeTimezonePoint(0, 90),
		makeTimezonePoint(0, 100),
		makeTimezonePoint(2, 100),
		makeTimezonePoint(2, 85),
		makeTimezonePoint(2, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(2, 46),
		makeTimezonePoint(2, 15),
		makeTimezonePoint(2, 0)
	],
	//-11
	[
		makeTimezonePoint(6, 0),
		makeTimezonePoint(6, 10),
		makeTimezonePoint(4, 12),
		makeTimezonePoint(4, 17),
		makeTimezonePoint(6, 18),
		makeTimezonePoint(6, 46),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(6, 52.5),
		makeTimezonePoint(6, 100),
		makeTimezonePoint(2, 100),
		makeTimezonePoint(2, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(2, 46),
		makeTimezonePoint(2, 0)
	],
	//-10
	[
		makeTimezonePoint(10, 0),
		makeTimezonePoint(10, 11),
		makeTimezonePoint(6, 10),
		makeTimezonePoint(4, 12),
		makeTimezonePoint(4, 17),
		makeTimezonePoint(6, 18),
		makeTimezonePoint(6, 46),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(6, 52.5),
		makeTimezonePoint(6, 100),
		makeTimezonePoint(10, 100),
		makeTimezonePoint(10, 17),
		makeTimezonePoint(6, 18),
		makeTimezonePoint(4, 17),
		makeTimezonePoint(4, 12),
		makeTimezonePoint(6, 10),
		makeTimezonePoint(6, 0)
	],
	[], //-9.5
	//-9
	[
		makeTimezonePoint(10, 11),
		makeTimezonePoint(10, 17),
		makeTimezonePoint(6, 18),
		makeTimezonePoint(4, 17),
		makeTimezonePoint(4, 12),
		makeTimezonePoint(6, 10),
		makeTimezonePoint(10, 11),
		makeTimezonePoint(10, 100),
		makeTimezonePoint(14, 100),
		makeTimezonePoint(14, 22),
		makeTimezonePoint(10, 17),
		makeTimezonePoint(10, 11),
		makeTimezonePoint(14, 11),
		makeTimezonePoint(14, 0),
		makeTimezonePoint(10, 0),
		makeTimezonePoint(10, 11)
	],
	//-8
	[
		makeTimezonePoint(14, 100),
		makeTimezonePoint(14, 22),
		makeTimezonePoint(10, 17),
		makeTimezonePoint(10, 16),

		makeTimezonePoint(10, 11),
		makeTimezonePoint(18, 11),
		makeTimezonePoint(18, 0),
		makeTimezonePoint(14, 0),
		makeTimezonePoint(14, 11),
		makeTimezonePoint(10, 11),
		makeTimezonePoint(10, 16),

		makeTimezonePoint(13, 16),
		makeTimezonePoint(18, 25),
		makeTimezonePoint(18, 100),
		makeTimezonePoint(14, 100)
	],
	//-7
	[
		makeTimezonePoint(18, 100),
		makeTimezonePoint(18, 25),
		makeTimezonePoint(13, 16),
		makeTimezonePoint(10, 16),
		makeTimezonePoint(10, 11),
		makeTimezonePoint(18, 11),
		makeTimezonePoint(18, 0),
		makeTimezonePoint(22, 0),
		makeTimezonePoint(22, 33),
		makeTimezonePoint(20, 35),
		makeTimezonePoint(20, 39),
		makeTimezonePoint(22, 41),
		makeTimezonePoint(22, 100)
	],
	//-6
	[
		makeTimezonePoint(22, 0),
		makeTimezonePoint(22, 33),
		makeTimezonePoint(20, 35),
		makeTimezonePoint(20, 35),
		makeTimezonePoint(20, 39),
		makeTimezonePoint(22, 41),
		makeTimezonePoint(22, 100),
		makeTimezonePoint(26, 100),
		makeTimezonePoint(26, 0)
	],
	//-5
	[
		makeTimezonePoint(26, 0),
		makeTimezonePoint(26, 100),
		makeTimezonePoint(30, 100),
		makeTimezonePoint(30, 0)
	],
	//-4
	[
		makeTimezonePoint(30, 100),
		makeTimezonePoint(34, 100),
		makeTimezonePoint(34, 70),
		makeTimezonePoint(30, 85),
		makeTimezonePoint(30, 63),
		makeTimezonePoint(34, 63),
		makeTimezonePoint(34, 10),
		makeTimezonePoint(30, 5),
		makeTimezonePoint(34, 3),
		makeTimezonePoint(34, 0),
		makeTimezonePoint(30, 0)
	],
	[], //-3.5
	//-3
	[
		makeTimezonePoint(34, 0),
		makeTimezonePoint(34, 3),
		makeTimezonePoint(30, 5),
		makeTimezonePoint(34, 10),
		makeTimezonePoint(34, 63),
		makeTimezonePoint(30, 63),
		makeTimezonePoint(30, 85),
		makeTimezonePoint(34, 70),
		makeTimezonePoint(34, 100),
		makeTimezonePoint(38, 100),
		makeTimezonePoint(38, 65),
		makeTimezonePoint(40, 53),
		makeTimezonePoint(38, 50),
		makeTimezonePoint(38, 17),
		makeTimezonePoint(34, 10),
		makeTimezonePoint(30, 5),
		makeTimezonePoint(34, 3),
		makeTimezonePoint(34, 0),
		makeTimezonePoint(38, 0),
		makeTimezonePoint(38, 3),
		makeTimezonePoint(34, 3)
	],
	//-2
	[
		makeTimezonePoint(42, 0),
		makeTimezonePoint(46, 5),
		makeTimezonePoint(44, 10),
		makeTimezonePoint(42, 12),
		makeTimezonePoint(42, 100),
		makeTimezonePoint(38, 100),
		makeTimezonePoint(38, 65),
		makeTimezonePoint(40, 53),
		makeTimezonePoint(38, 50),
		makeTimezonePoint(38, 17),
		makeTimezonePoint(34, 10),
		makeTimezonePoint(30, 5),
		makeTimezonePoint(34, 3),
		makeTimezonePoint(38, 3),
		makeTimezonePoint(38, 0)
	],
	//-1
	[
		makeTimezonePoint(42, 0),
		makeTimezonePoint(46, 0),
		makeTimezonePoint(46, 100),
		makeTimezonePoint(42, 100),
		makeTimezonePoint(42, 12),
		makeTimezonePoint(44, 10),
		makeTimezonePoint(46, 5)
	],
	//0
	[
		makeTimezonePoint(46, 0),
		makeTimezonePoint(46, 100),
		makeTimezonePoint(50, 100),
		makeTimezonePoint(50, 40),
		makeTimezonePoint(48, 38),
		makeTimezonePoint(46, 39),
		makeTimezonePoint(46, 30),
		makeTimezonePoint(48, 30),
		makeTimezonePoint(48, 23),
		makeTimezonePoint(50, 22),
		makeTimezonePoint(50, 0)
	],
	//1
	[
		makeTimezonePoint(50, 100),
		makeTimezonePoint(54 + 1, 100),
		makeTimezonePoint(54 + 1, 63),
		makeTimezonePoint(56 + 1, 63),
		makeTimezonePoint(56 + 1, 38),
		makeTimezonePoint(54 + 1, 38),
		makeTimezonePoint(54 + 1, 30),
		makeTimezonePoint(56 + 1, 30),
		makeTimezonePoint(56 + 1, 21),
		makeTimezonePoint(55 + 1, 20),
		makeTimezonePoint(58 + 1, 6),
		makeTimezonePoint(55, 0),
		makeTimezonePoint(50, 0),
		makeTimezonePoint(50, 22),
		makeTimezonePoint(48, 23),
		makeTimezonePoint(48, 30),
		makeTimezonePoint(46, 30),
		makeTimezonePoint(46, 39),
		makeTimezonePoint(48, 38),
		makeTimezonePoint(50, 40),
		makeTimezonePoint(50, 100)
	],
	//2
	[
		makeTimezonePoint(54 + 1, 38),
		makeTimezonePoint(54 + 1, 30),
		makeTimezonePoint(56 + 1, 30),
		makeTimezonePoint(56 + 1, 21),
		makeTimezonePoint(55 + 1, 20),
		makeTimezonePoint(58 + 1, 6),
		makeTimezonePoint(54 + 1, 0),
		makeTimezonePoint(58 + 2, 0),
		makeTimezonePoint(60, 35),
		makeTimezonePoint(62 + 1, 42),
		makeTimezonePoint(58 + 1, 50),
		makeTimezonePoint(62 + 2, 54),
		makeTimezonePoint(62 + 2, 60),
		makeTimezonePoint(58 + 3, 75),
		makeTimezonePoint(58 + 3, 100),
		makeTimezonePoint(54 + 1, 100),
		makeTimezonePoint(54 + 1, 63),
		makeTimezonePoint(56 + 1, 63),
		makeTimezonePoint(56 + 1, 38),
		makeTimezonePoint(54 + 1, 38)
	],
	//3
	[
		makeTimezonePoint(58 + 2, 0),
		makeTimezonePoint(60, 35),
		makeTimezonePoint(62 + 1, 42),
		makeTimezonePoint(58 + 1, 50),
		makeTimezonePoint(62 + 2, 54),
		makeTimezonePoint(62 + 2, 60),
		makeTimezonePoint(61, 75),
		makeTimezonePoint(61, 100),
		makeTimezonePoint(66, 100),
		makeTimezonePoint(66, 37),

		makeTimezonePoint(63, 28),
		makeTimezonePoint(66, 28),

		makeTimezonePoint(70, 0)
	],
	[], //3.14
	//3.5 (Iran)
	[
		makeTimezonePoint(63, 28),
		makeTimezonePoint(66, 28),
		makeTimezonePoint(68, 29),
		makeTimezonePoint(68, 33),
		makeTimezonePoint(69, 37),
		makeTimezonePoint(67, 37),
		makeTimezonePoint(66, 37)
	],
	[], //4
	[], //4.5
	//5
	[
		makeTimezonePoint(66, 100),
		makeTimezonePoint(71, 100),
		makeTimezonePoint(71, 45),
		makeTimezonePoint(69, 35),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 26),
		makeTimezonePoint(72, 0),
		makeTimezonePoint(70, 0),
		makeTimezonePoint(66, 28),
		makeTimezonePoint(68, 29),
		makeTimezonePoint(68, 33),
		makeTimezonePoint(69, 37),
		makeTimezonePoint(66, 37)
	],
	//5.5 (India)
	[
		makeTimezonePoint(69, 35),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(76, 34),
		makeTimezonePoint(76, 38),
		makeTimezonePoint(72, 48),
		makeTimezonePoint(71, 45)
	],
	[], //5.75
	//6
	[
		makeTimezonePoint(71, 100),
		makeTimezonePoint(71, 45),
		makeTimezonePoint(72, 48),
		makeTimezonePoint(76, 38),

		makeTimezonePoint(76, 34),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 26),
		makeTimezonePoint(76, 28),

		makeTimezonePoint(76, 0),
		makeTimezonePoint(72, 0),

		makeTimezonePoint(72, 26),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(76, 34),

		makeTimezonePoint(76, 100)
	],
	[], //6.5
	//7
	[
		makeTimezonePoint(76, 100),
		makeTimezonePoint(82, 100),
		makeTimezonePoint(82, 42),
		makeTimezonePoint(80, 40),
		makeTimezonePoint(76, 38),

		makeTimezonePoint(76, 34),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 26),
		makeTimezonePoint(76, 28),
		makeTimezonePoint(76, 24),
		makeTimezonePoint(78, 20),

		makeTimezonePoint(78, 5),

		makeTimezonePoint(82, 5),
		makeTimezonePoint(82, 0),
		makeTimezonePoint(76, 0),

		makeTimezonePoint(76, 24),
		makeTimezonePoint(76, 28),
		makeTimezonePoint(72, 26),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(76, 34),
		makeTimezonePoint(76, 38),
		makeTimezonePoint(76, 100)
	],
	//8
	[
		makeTimezonePoint(82, 100),
		makeTimezonePoint(86, 100),
		makeTimezonePoint(86, 40),
		makeTimezonePoint(84, 28),
		makeTimezonePoint(86, 26),
		makeTimezonePoint(86, 0),
		makeTimezonePoint(82, 0),
		makeTimezonePoint(82, 9),
		makeTimezonePoint(86, 10),
		makeTimezonePoint(86, 26),
		makeTimezonePoint(84, 22),
		makeTimezonePoint(82, 26),
		makeTimezonePoint(80, 26),
		makeTimezonePoint(80, 24),
		makeTimezonePoint(82, 20),
		makeTimezonePoint(80, 18),
		makeTimezonePoint(78, 20),
		makeTimezonePoint(76, 24),
		makeTimezonePoint(76, 28),
		makeTimezonePoint(72, 26),
		makeTimezonePoint(70, 30),
		makeTimezonePoint(72, 34),
		makeTimezonePoint(76, 34),
		makeTimezonePoint(76, 38),
		makeTimezonePoint(80, 40),
		makeTimezonePoint(82, 42),
		makeTimezonePoint(82, 100)
	],
	[], //8.75
	//9
	[
		makeTimezonePoint(86, 0),
		makeTimezonePoint(86, 10),
		makeTimezonePoint(82, 9),
		makeTimezonePoint(82, 5),
		makeTimezonePoint(78, 5),
		makeTimezonePoint(78, 20),
		makeTimezonePoint(80, 18),
		makeTimezonePoint(82, 20),
		makeTimezonePoint(80, 24),
		makeTimezonePoint(80, 26),
		makeTimezonePoint(82, 26),
		makeTimezonePoint(84, 22),
		makeTimezonePoint(86, 26),
		makeTimezonePoint(86, 10),
		makeTimezonePoint(86, 26),
		makeTimezonePoint(84, 28),
		makeTimezonePoint(86, 40),
		makeTimezonePoint(86, 100),
		makeTimezonePoint(90, 100),
		makeTimezonePoint(90, 0)
	],
	[], //9.5
	//10
	[
		makeTimezonePoint(90, 100),
		makeTimezonePoint(90, 0),
		makeTimezonePoint(94, 0),
		makeTimezonePoint(94, 100)
	],
	[], //10.5
	//11
	[
		makeTimezonePoint(94, 100),
		makeTimezonePoint(94, 0),
		makeTimezonePoint(98, 0),
		makeTimezonePoint(98, 100)
	],
	//12
	[
		makeTimezonePoint(98, 100),
		makeTimezonePoint(98, 0),
		makeTimezonePoint(100, 0),
		makeTimezonePoint(100, 100),

		//second part
		makeTimezonePoint(0, 100),
		makeTimezonePoint(0, 90),
		makeTimezonePoint(2, 85),
		makeTimezonePoint(2, 50),
		makeTimezonePoint(0, 50),
		makeTimezonePoint(0, 17),
		makeTimezonePoint(2, 15),
		makeTimezonePoint(2, 10),
		makeTimezonePoint(0, 8),
		makeTimezonePoint(0, 100)
	],
	//13
	[
		makeTimezonePoint(2, 54),
		makeTimezonePoint(6, 52.5),
		makeTimezonePoint(6, 46),
		makeTimezonePoint(2, 46),
		makeTimezonePoint(2, 54)
	],
	[], //13.75
	//14
	[
		makeTimezonePoint(6, 46),
		makeTimezonePoint(8, 46),
		makeTimezonePoint(10, 52),
		makeTimezonePoint(8, 54),
		makeTimezonePoint(7, 52),
		makeTimezonePoint(6, 52.5)
	]
].reverse(); //we do same with timezoneList

export const dateToString = (d: Date): string => {
	return d.toISOString().split(':').splice(0, 2).join(':');
};

if (timezoneList.length !== timezonePointList.length) {
	throw error(500, `Assertion failed ${timezoneList.length} ${timezonePointList.length}`);
}

export const asyncDelay = (time: number) => {
	return new Promise((resolve) =>
		setTimeout(() => {
			resolve(0);
		}, time)
	);
};

export const PROGRAM_VERSION = '1.0.3';
//own festive mix
export const DEFAULT_PLAYLIST =
	'https://www.youtube.com/embed/videoseries?loop=1&si=9tV7jJed9H4lPkHr&amp;list=PL5d1YE_8Im7Nh_4krlRdBNBsGJFioTzl5';

export const HARD_SNOWFLAKE_LIMIT = 2000;

export const BEAT_FREQUENCY = 180000;
