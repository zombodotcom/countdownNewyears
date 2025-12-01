import { locales } from '$lib/paraglide/runtime.js';
import type { LanguageType } from '$lib/types.js';

export const load = async (event) => {
	if(event.cookies.get("set") != "true") {
		event.cookies.set("background", "#460809", { path: '/' });
		event.cookies.set("languages", JSON.stringify(locales), { path: '/' });
		event.cookies.set("playlist", "https://www.youtube-nocookie.com/embed/videoseries?si=0Ck0t51FdMo_lDev&amp;list=PL5d1YE_8Im7NeG2G09qax1KZPClQbE1p7", { path: '/' });
		event.cookies.set("millisecond", "false", { path: '/' });
		event.cookies.set("journey", "true", { path: '/' });

		event.cookies.set("set", "true", { path: '/' });
	}

	return {
		background: event.cookies.get("background") as string,
		languages: JSON.parse(event.cookies.get("languages") as string) as LanguageType[],
		playlist: event.cookies.get("playlist") as string,
		millisecond: event.cookies.get("millisecond") as string === "true",
		journey: event.cookies.get("journey") as string === "true",
	}
};