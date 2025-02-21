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
	TVDiscover,
	PersonPopular
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

export const onCinemaMovie = async (region = 'US', page = 1) => {
	const now = Date.now();

	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			page: String(page),
			watch_region: region,
			sort_by: 'popularity.desc',
			region: region,
			with_release_type: '2|3',
			'release_date.gte': getDate(now - week * 2),
			'release_date.lte': getDate(now + day),
			with_watch_monetization_type: 'flatrate',
			without_keywords: 'softcore|sexy'
		}
	});

	return data;
};

export const popularMovie = async (page = 1) => {
	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			page: String(page),
			sort_by: 'popularity.desc',
			without_keywords: 'softcore|sexy'
		}
	});

	return data;
};

export const upcomingMovie = async (page = 1) => {
	const now = Date.now();

	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			page: String(page),
			sort_by: 'popularity.desc',
			with_release_type: '1|2|3',
			'primary_release_date.gte': getDate(now + day),
			'primary_release_date.lte': getDate(now + day * 30),
			without_keywords: 'softcore|sexy'
		}
	});

	return data;
};

export const topRatedmovie = async (page = 1) => {
	const data = await api<MovieDiscover>({
		endpoint: '/discover/movie',
		query: {
			sort_by: 'vote_average.desc',
			without_genres: '99',
			'vote_count.gte': '2000',
			page: String(page)
		}
	});

	return data;
};

export const movieResult = async (id: string, region_code = 'US') => {
	const data = await api<MovieDetail>({
		endpoint: `/movie/${id}`,
		query: {
			append_to_response: 'videos,release_dates'
		}
	});

	const { release_dates, origin_country, ...res } = data;

	let certificate: { iso_3166_1: string; certificate: string } | undefined;

	originLoop: for (const origin of origin_country) {
		releaseLoop: for (const releases of release_dates.results) {
			if (releases.iso_3166_1 === region_code) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1,
							certificate: cert.certification
						};
						break originLoop;
					}
				}
			}

			if (releases.iso_3166_1 === origin) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1,
							certificate: cert.certification
						};
						continue releaseLoop;
					}
				}
			}

			if (!certificate) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1!,
							certificate: cert.certification
						};
						continue releaseLoop;
					}
				}
			}
		}
	}

	return {
		...res,
		certificate
	};
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

	let certificate: { iso_3166_1: string; certificate: string } | undefined;

	originLoop: for (const origin of origin_country) {
		releaseLoop: for (const releases of release_dates.results) {
			if (releases.iso_3166_1 === region_code) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1,
							certificate: cert.certification
						};
						break originLoop;
					}
				}
			}

			if (releases.iso_3166_1 === origin) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1,
							certificate: cert.certification
						};
						continue releaseLoop;
					}
				}
			}

			if (!certificate) {
				for (const cert of releases.release_dates) {
					if (cert.certification) {
						certificate = {
							iso_3166_1: releases.iso_3166_1!,
							certificate: cert.certification
						};
						continue releaseLoop;
					}
				}
			}
		}
	}

	const backdropImage = mediaImages.backdrops.map((image) => ({ ...image, backdrop: true }));

	const images = [...mediaImages.posters, ...backdropImage] as CombineImage[];

	return {
		...res,
		release_dates,
		origin_country,
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
			'vote_count.gte': '1000',
			page: String(page)
		}
	});

	return data;
};

export const tvResult = async (id: string, region_code = 'US') => {
	const data = await api<TvSeriesDetail>({
		endpoint: `/tv/${id}`,
		query: {
			append_to_response: 'videos,content_ratings'
		}
	});

	const { content_ratings, origin_country, ...res } = data;

	let certificate: { iso_3166_1: string; rating: string } | undefined;

	originLoop: for (const origin of origin_country) {
		certificateLoop: for (const rating of content_ratings.results) {
			if (rating.iso_3166_1 === region_code) {
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};

				break originLoop;
			}
			if (rating.iso_3166_1 === origin) {
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};
				continue certificateLoop;
			}

			if (!certificate) {
				if (rating.iso_3166_1 === 'US') {
					certificate = {
						iso_3166_1: rating.iso_3166_1,
						rating: rating.rating
					};

					continue certificateLoop;
				}
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};

				continue certificateLoop;
			}
		}
	}

	return {
		...res,
		certificate
	};
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

	let certificate: { iso_3166_1: string; rating: string } | undefined;

	originLoop: for (const origin of origin_country) {
		certificateLoop: for (const rating of content_ratings.results) {
			if (rating.iso_3166_1 === region_code) {
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};

				break originLoop;
			}
			if (rating.iso_3166_1 === origin && origin !== 'US') {
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};
				continue certificateLoop;
			}

			if (!certificate) {
				if (rating.iso_3166_1 === 'US') {
					certificate = {
						iso_3166_1: rating.iso_3166_1,
						rating: rating.rating
					};

					continue certificateLoop;
				}
				certificate = {
					iso_3166_1: rating.iso_3166_1,
					rating: rating.rating
				};

				continue certificateLoop;
			}
		}
	}

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

export const popularPerson = async (page = 1) => {
	const data = await api<PersonPopular>({
		endpoint: '/person/popular',
		query: {
			page: String(page)
		}
	});

	return data;
};
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
