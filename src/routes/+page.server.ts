import type { PageServerLoad } from "./$types";

import { movieTrending, trendingAll, tvTrending } from "$lib/server/movie";

export const load: PageServerLoad = async () => {
	const [movies, tv, all] = await Promise.all([
		movieTrending(),
		tvTrending(),
		trendingAll()
	]);

	/* setHeaders({
		"cache-control": "public, max-age=86400"
	}); */

	return {
		trendingMovie: movies.results,
		trendingTv: tv.results,
		trendingAll: all.results
	};
};
