import type { LayoutServerLoad } from "./$types";

import { tvResultDetail } from "$lib/server/movie";

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const id = params.id;

	const { region } = locals.preference;

	const data = await tvResultDetail(id, region.code);

	return {
		tv: data,
		meta: {
			title: data.name,
			description: data.overview
		}
	};
};
