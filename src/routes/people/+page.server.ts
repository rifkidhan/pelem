import type { PageServerLoad } from './$types';
import { popularPerson } from '$lib/server/movie';

export const load: PageServerLoad = async ({ url }) => {
	let page = 1;
	const getPage = url.searchParams.get('page');

	if (getPage) {
		page = parseInt(getPage);
	}

	const data = await popularPerson(page);

	return {
		person: data,
		meta: {
			title: 'Person'
		}
	};
};
