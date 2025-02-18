import type { PageServerLoad } from './$types';

import { seasonDetail } from '$lib/server/movie';

export const load: PageServerLoad = async ({ params, setHeaders, parent }) => {
	const res = await seasonDetail(params.id, params.season);

	const parentData = await parent();

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		season: res,
		meta: {
			title: `${parentData.meta.title}: ${res.name}`,
			description: res.overview ? res.overview : parentData.meta.description
		}
	};
};
