import type { PageServerLoad } from './$types';
import { topRatedTv } from '$lib/server/movie';

const loadData = async (param: string, region: string, page: number) => {
	switch (param) {
		case 'top-rated':
			return {
				title: 'Top Rated TV Shows',
				data: await topRatedTv(page)
			};

		default:
			return {
				title: 'Popular Movies',
				data: await topRatedTv(page)
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
