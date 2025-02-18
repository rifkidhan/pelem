import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders, parent }) => {
	const data = await parent();

	setHeaders({
		'cache-control': 'public, max-age=86400'
	});

	return {
		meta: {
			...data.meta,
			title: `${data.meta.title} - Media`
		}
	};
};
