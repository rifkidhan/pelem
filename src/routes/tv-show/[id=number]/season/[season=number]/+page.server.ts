import type { PageServerLoad } from './$types';

import { seasonDetail } from '$lib/server/movie';

export const load: PageServerLoad = async ({ params }) => {
	const res = await seasonDetail(params.id, params.season);

	return {
		season: res
	};
};
