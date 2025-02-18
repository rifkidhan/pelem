import { API_SECRET, API_URL } from '$env/static/private';
import type {
	CombineCast,
	CombineCrew,
	CombineImage,
	MovieDetail,
	MovieDiscover,
	MovieTrending,
	PersonDetail,
	SeasonDetail,
	TrendingAll,
	TvSeriesDetail,
	TVTrending,
	TVDiscover
} from '$lib/types';
import { shuffle } from '$lib/utils/array';
import { error } from '@sveltejs/kit';

const api = async <T>({
	endpoint,
	query
}: {
	endpoint: string;
	query?: Record<string, string>;
}): Promise<T | never> => {
	const url = new URL(API_URL + endpoint);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value);
		}
	}

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${API_SECRET}`,
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		error(res.status, res.statusText);
	}

	return await res.json();
};

const getDate = (date: number) => {
	const dateFormat = new Date(date);

	return new Intl.DateTimeFormat('fr-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(dateFormat);
};
const day = 86400000;
const week = 604800000;

// Trending

export const trendingAll = async () => {
	const data = await api<TrendingAll>({ endpoint: '/trending/all/day' });

	return data;
};

export const movieTrending = async (time = 'week') => {
	const data = await api<MovieTrending>({ endpoint: `/trending/movie/${time}` });

	return data;
};

export const tvTrending = async (time = 'week') => {
	const data = await api<TVTrending>({ endpoint: `/trending/tv/${time}` });

	return data;
};

// Movie Results

export const getMoviesOnCinema = async (region = 'US', page = 1) => {
	const now = Date.now();

	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			adult: 'false',
			include_video: 'false',
			page: String(page),
			watch_region: region,
			region: region,
			with_release_type: '2|3',
			'release_date.gte': getDate(now - week * 2),
			'release_date.lte': getDate(now + day),
			with_watch_monetization_type: 'flatrate',
			without_keywords: 'softcore'
		}
	});

	return data;
};

export const getTopRatedMovie = async (page = 1) => {
	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			include_adult: 'false',
			include_video: 'false',
			sort_by: 'vote_average.desc',
			without_genres: '99',
			'vote_count.gte': '2000',
			page: String(page)
		}
	});

	return data;
};

export const movieResult = async (id: string) => {
	const data = await api<MovieDetail>({
		endpoint: `/movie/${id}`,
		query: {
			append_to_response: 'videos,release_dates'
		}
	});

	return data;
};

export const movieResultDetail = async (id: string, region_code = 'US') => {
	const data = await api<MovieDetail>({
		endpoint: `/movie/${id}`,
		query: {
			append_to_response:
				'videos,release_dates,credits,alternative_titles,recommendations,external_ids,keywords,images',
			include_image_language: 'en,null'
		}
	});

	const { release_dates, origin_country, images: mediaImages, ...res } = data;

	const getCertificate = release_dates.results.filter((cert) =>
		cert.release_dates.find((v) => v.certification !== '')
	);

	const certificate = origin_country.flatMap((origin) => {
		const findByorigin = getCertificate.find(
			(cert) => cert.iso_3166_1 === region_code || cert.iso_3166_1 === origin
		);

		if (!findByorigin) return getCertificate[0];

		return findByorigin;
	})[0];

	const release_dates_filter = data.origin_country.flatMap((origin) =>
		data.release_dates.results.filter(
			(release) => release.iso_3166_1 === region_code || release.iso_3166_1 === origin
		)
	);

	const backdropImage = mediaImages.backdrops.map((image) => ({ ...image, backdrop: true }));

	const images = [...mediaImages.posters, ...backdropImage] as CombineImage[];

	return {
		...res,
		release_dates,
		origin_country,
		release_dates_filter,
		certificate,
		images: shuffle(images)
	};
};

// Tv results

export const getTopRatedTv = async (page = 1) => {
	const data = await api<TVDiscover>({
		endpoint: '/discover/tv',
		query: {
			include_adult: 'false',
			include_video: 'false',
			sort_by: 'vote_average.desc',
			'vote_count.gte': '2000',
			page: String(page)
		}
	});

	return data;
};

export const tvResult = async (id: string) => {
	const data = await api<TvSeriesDetail>({
		endpoint: `/tv/${id}`,
		query: {
			append_to_response: 'videos,content_ratings'
		}
	});

	return data;
};

export const tvResultDetail = async (id: string, region_code = 'US') => {
	const data = await api<TvSeriesDetail>({
		endpoint: `/tv/${id}`,
		query: {
			append_to_response:
				'videos,alternative_titles,content_ratings,external_ids,aggregate_credits,recommendations,images,keywords',
			include_image_language: 'en,null'
		}
	});

	const { origin_country, content_ratings, images: mediaImages, ...res } = data;

	const certificate = origin_country.flatMap((origin) => {
		const ratingRequirement = content_ratings.results.filter(
			(r) => r.iso_3166_1 === region_code || r.iso_3166_1 === origin || r.iso_3166_1 === 'US'
		);

		const region = ratingRequirement.find((r) => r.iso_3166_1 === region_code);

		if (region) return region;

		const originRes = ratingRequirement.find((r) => r.iso_3166_1 === origin);

		if (originRes) return originRes;

		const usRating = ratingRequirement.find((r) => r.iso_3166_1 === 'US');

		if (usRating) return usRating;

		return data.content_ratings.results[0];
	})[0];

	const backdropImage = mediaImages.backdrops.map((image) => ({ ...image, backdrop: true }));

	const images = [...mediaImages.posters, ...backdropImage] as CombineImage[];

	return {
		...res,
		origin_country,
		content_ratings,
		certificate,
		images: shuffle(images)
	};
};

export const seasonDetail = async (series_id: string, season_number: string) => {
	const data = await api<SeasonDetail>({
		endpoint: `/tv/${series_id}/season/${season_number}`,
		query: {
			append_to_response: 'videos,aggregate_credits'
		}
	});

	return data;
};

// Person Results

export const personResultDetail = async (id: string) => {
	const data = await api<PersonDetail>({
		endpoint: `/person/${id}`,
		query: {
			append_to_response: 'external_ids,combined_credits'
		}
	});

	const { combined_credits, ...res } = data;

	const cast_credits = new Map<string, CombineCast>();
	const crew_credits = new Map<string, CombineCrew>();

	for (const credit of combined_credits.cast) {
		const id = btoa(`${credit.id}-${credit.media_type}`);

		if (cast_credits.has(id)) {
			cast_credits.get(id)?.roles.push({
				credit_id: credit.credit_id,
				character: credit.character,
				episode_count: credit.episode_count,
				order: credit.order
			});
		} else {
			cast_credits.set(id, {
				...credit,
				roles: [
					{
						credit_id: credit.credit_id,
						character: credit.character,
						episode_count: credit.episode_count,
						order: credit.order
					}
				]
			});
		}
	}

	for (const credit of combined_credits.crew) {
		const id = btoa(`${credit.id}-${credit.media_type}`);

		if (crew_credits.has(id)) {
			crew_credits.get(id)?.jobs.push({
				credit_id: credit.credit_id,
				job: credit.job,
				episode_count: credit.episode_count,
				order: credit.order
			});
		} else {
			crew_credits.set(id, {
				...credit,
				jobs: [
					{
						credit_id: credit.credit_id,
						job: credit.job,
						episode_count: credit.episode_count,
						order: credit.order
					}
				]
			});
		}
	}

	const popular_cast = cast_credits
		.values()
		.toArray()
		.sort(
			(a, b) =>
				(b.vote_count * b.vote_average) / b.popularity -
				(a.vote_count * a.vote_average) / a.popularity
		)
		.slice(0, 10);
	const popular_crew = crew_credits
		.values()
		.toArray()
		.sort(
			(a, b) =>
				(b.vote_count * b.vote_average) / b.popularity -
				(a.vote_count * a.vote_average) / a.popularity
		)
		.slice(0, 10);

	const cast_sort = cast_credits
		.values()
		.toArray()
		.map((item) => {
			const getDate = item.release_date ?? item.first_air_date;
			const date = getDate ? new Date(getDate) : Date.now();

			return {
				...item,
				date
			};
		})
		.sort((a, b) => b.date.valueOf() - a.date.valueOf());

	const crew_sort = crew_credits
		.values()
		.toArray()
		.map((item) => {
			const getDate = item.release_date ?? item.first_air_date;
			const date = getDate ? new Date(getDate) : Date.now();

			return {
				...item,
				date
			};
		})
		.sort((a, b) => b.date.valueOf() - a.date.valueOf());

	return {
		...res,
		combine_cast: cast_sort,
		combine_crew: crew_sort,
		popular_cast: popular_cast,
		popular_crew: popular_crew
	};
};
