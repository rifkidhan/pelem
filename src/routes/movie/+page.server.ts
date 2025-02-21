import type { PageServerLoad } from './$types';
import {
	onCinemaMovie,
	movieResult,
	movieTrending,
	topRatedmovie,
	upcomingMovie,
	popularMovie
} from '$lib/server/movie';
import { randomize } from '$lib/utils/array';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
	const { region } = locals.preference;
	const dayTrending = await movieTrending('day');

	const pickRandom = randomize(dayTrending.results);

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		weekTrending: movieTrending(),
		topRated: topRatedmovie(),
		onCinema: onCinemaMovie(region, 1),
		upcoming: upcomingMovie(),
		popular: popularMovie(),
		dayTrending,
		random: await movieResult(String(pickRandom.id), region),
		meta: {
			title: 'Movies'
		}
	};
};
