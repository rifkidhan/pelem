import type { PageServerLoad } from './$types';

import { tvResult, tvTrending, getTopRatedTv } from '$lib/server/movie';
import { randomize } from '$lib/utils/array';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
	const { region } = locals.preference;
	const dayTrending = await tvTrending('day');

	const pickRandom = randomize(dayTrending.results);

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		weekTrending: tvTrending(),
		top_rated: getTopRatedTv(),
		dayTrending,
		random: await tvResult(String(pickRandom.id), region),
		meta: {
			title: 'TV Series'
		}
	};
};
