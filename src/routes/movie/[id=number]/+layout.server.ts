import type { LayoutServerLoad } from './$types';

import { movieResultDetail } from '$lib/server/movie';
import { getYear } from '$lib/utils/format';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const id = params.id;

	const { region } = locals.preference;

	const data = await movieResultDetail(id, region.code);

	const meta_title = data.title
		? data.release_date
			? `${data.title} (${getYear(data.release_date)})`
			: data.title
		: undefined;

	return {
		movie: data,
		meta: {
			title: meta_title,
			description: data.overview
		}
	};
};
