import type { PageServerLoad } from "./$types";

import { personResultDetail } from "$lib/server/movie";

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const data = await personResultDetail(id);

	return {
		people: data,
		meta: {
			title: data.name,
			description: data.biography
		}
	};
};
