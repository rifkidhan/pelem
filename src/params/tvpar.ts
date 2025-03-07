// use for tv show
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (
	param: string
): param is 'popular' | 'top-rated' | 'upcoming' | 'now-playing' => {
	return (
		param === 'popular' || param === 'top-rated' || param === 'upcoming' || param === 'now-playing'
	);
};
