import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const preload = ['js', 'css', 'font'];

const region = (req: Request) => {
	const code = req.headers.get('X-Vercel-IP-Country') ?? 'ID';

	return code;
};

const handlePreference: Handle = async ({ event, resolve }) => {
	const preference = event.cookies.get('preference');

	if (!preference) {
		const location = region(event.request);

		const setPrefence = {
			lang: 'en-US',
			region: location
		};

		event.cookies.set('preference', JSON.stringify(setPrefence), { path: '/' });
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
