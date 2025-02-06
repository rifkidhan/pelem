import { getLocation } from "$lib/server/geolocation";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const preload = ["js", "css", "font"];

const handlePreference: Handle = async ({ event, resolve }) => {
	const preference = event.cookies.get("preference");

	if (!preference) {
		const location = await getLocation();

		const setPrefence = {
			lang: "en-US",
			region: {
				code: location.code,
				name: location.name,
				timezone: location.timezone
			}
		};

		event.cookies.set("preference", JSON.stringify(setPrefence), { path: "/" });
		event.locals.preference = setPrefence;

		return resolve(event);
	}

	event.locals.preference = JSON.parse(preference!);

	return resolve(event);
};

const handleRoute: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		preload: ({ type }) => preload.includes(type)
	});

	return response;
};

export const handle: Handle = sequence(handlePreference, handleRoute);
