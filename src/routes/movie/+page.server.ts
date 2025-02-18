import type { PageServerLoad } from './$types';

import { getMoviesOnCinema, movieResult, movieTrending, getTopRatedMovie } from '$lib/server/movie';
import { randomize } from '$lib/utils/array';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
	const { code } = locals.preference.region;
	const dayTrending = await movieTrending('day');

	const pickRandom = randomize(dayTrending.results);

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		weekTrending: movieTrending(),
		topRated: getTopRatedMovie(),
		onCinema: getMoviesOnCinema(code, 1),
		dayTrending,
		random: await movieResult(String(pickRandom.id)),
		meta: {
			title: 'Movies'
		}
	};
};
