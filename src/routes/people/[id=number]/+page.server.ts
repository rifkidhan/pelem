import type { PageServerLoad } from './$types';

import { personResultDetail } from '$lib/server/movie';

export const load: PageServerLoad = async ({ params }) => {
	const data = await personResultDetail(params.id);

	return {
		people: data,
		meta: {
			title: data.name,
			description: data.biography
		}
	};
};
