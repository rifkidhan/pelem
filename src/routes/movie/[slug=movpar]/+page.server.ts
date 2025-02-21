import type { PageServerLoad } from './$types';
import { topRatedmovie, upcomingMovie, onCinemaMovie, popularMovie } from '$lib/server/movie';

const loadData = async (param: string, region: string, page: number) => {
	switch (param) {
		case 'top-rated':
			return {
				title: 'Top Rated Movies',
				data: await topRatedmovie(page)
			};
		case 'upcoming':
			return {
				title: 'Upcoming Movies',
				data: await upcomingMovie(page)
			};
		case 'now-playing':
			return {
				title: 'Movies on cinemas',
				data: await onCinemaMovie(region, page)
			};
		case 'popular':
			return {
				title: 'Popular Movies',
				data: await popularMovie(page)
			};

		default:
			return {
				title: 'Popular Movies',
				data: await popularMovie(page)
			};
	}
};

export const load: PageServerLoad = async ({ params, url, locals, setHeaders }) => {
	const { region } = locals.preference;
	let page = 1;
	const pageNow = url.searchParams.get('page');

	if (pageNow) {
		page = parseInt(pageNow);
	}

	const data = await loadData(params.slug, region, page);

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		lists: data.data,
		meta: {
			title: data.title
		}
	};
};
