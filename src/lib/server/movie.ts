import { API_SECRET, API_URL } from "$env/static/private";
import type {
	CombineCast,
	CombineCrew,
	CombineImage,
	MovieDetail,
	MovieTrending,
	PersonDetail,
	SeasonDetail,
	TrendingAll,
	TvSeriesDetail,
	TVTrending
} from "$lib/types";
import { shuffle } from "$lib/utils/random";
import { error } from "@sveltejs/kit";

const api = async <T>(
	{ endpoint, query }: { endpoint: string; query?: Record<string, string> }
): Promise<T | never> => {
	const url = new URL(API_URL + endpoint);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value);
		}
	}

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_SECRET}`,
			Accept: "application/json"
		}
	});

	if (!res.ok) {
		error(res.status, res.statusText);
	}

	return await res.json();
};

export const trendingAll = async () => {
	const data = await api<TrendingAll>({ endpoint: "/trending/all/day" });

	return data;
};

export const movieTrending = async () => {
	const data = await api<MovieTrending>({ endpoint: "/trending/movie/week" });

	return data;
};

export const tvTrending = async () => {
	const data = await api<TVTrending>({ endpoint: "/trending/tv/week" });

	return data;
};

export const movieResultDetail = async (id: string, region_code = "US") => {
	const data = await api<MovieDetail>({
		endpoint: `/movie/${id}`,
		query: {
			append_to_response:
				"videos,release_dates,credits,alternative_titles,recommendations,external_ids,keywords,images"
		}
	});

	const { release_dates, origin_country, images: mediaImages, ...res } = data;

	const getCertificate = release_dates.results.filter(cert =>
		cert.release_dates.find(v => v.certification !== "")
	);

	const certificate = origin_country.flatMap(origin => {
		const findByorigin = getCertificate.find(cert =>
			cert.iso_3166_1 === region_code || cert.iso_3166_1 === origin
		);

		if (!findByorigin) return getCertificate[0];

		return findByorigin;
	})[0];

	const release_dates_filter = data.origin_country.flatMap(origin =>
		data.release_dates.results.filter(release =>
			release.iso_3166_1 === region_code || release.iso_3166_1 === origin
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

export const tvResultDetail = async (id: string, region_code = "US") => {
	const data = await api<TvSeriesDetail>({
		endpoint: `/tv/${id}`,
		query: {
			append_to_response:
				"videos,alternative_titles,content_ratings,external_ids,aggregate_credits,recommendations,images,keywords"
		}
	});

	const { origin_country, content_ratings, images: mediaImages, ...res } = data;

	const certificate = origin_country.flatMap(origin => {
		const ratingRequirement = content_ratings.results.filter((r) =>
			r.iso_3166_1 === region_code || r.iso_3166_1 === origin || r.iso_3166_1 === "US"
		);

		const region = ratingRequirement.find(r => r.iso_3166_1 === region_code);

		if (region) return region;

		const originRes = ratingRequirement.find(r => r.iso_3166_1 === origin);

		if (originRes) return originRes;

		const usRating = ratingRequirement.find(r => r.iso_3166_1 === "US");

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
		endpoint: `/tv/${series_id}/season/${season_number}`
	});

	return data;
};

export const personResultDetail = async (id: string) => {
	const data = await api<PersonDetail>({
		endpoint: `/person/${id}`,
		query: {
			append_to_response: "external_ids,combined_credits"
		}
	});

	const { combined_credits, ...res } = data;

	const getPopularCredits = (key: keyof typeof combined_credits) => {
		return combined_credits[key].length > 10
			? combined_credits[key]
				.sort((a, b) =>
					((b.vote_count * b.vote_average) / b.popularity)
					- ((a.vote_count * a.vote_average) / a.popularity)
				)
				.filter((credit, pos, credits) => {
					if (
						!pos
						|| credit.id === credits[pos - 1].id
							&& credit.media_type === credits[pos - 1].media_type
					) {
						return false;
					}
					if (credit.release_date || credit.first_air_date) return true;

					return false;
				})
				.slice(0, 10)
			: combined_credits[key];
	};

	const getSortCombineCredits = (key: keyof typeof combined_credits) => {
		const combine = combined_credits[key].map((item) => {
			const getDate = item.release_date ?? item.first_air_date;
			const date = getDate ? new Date(getDate) : Date.now();

			return {
				...item,
				date
			};
		});

		return combine.sort((a, b) => b.date.valueOf() - a.date.valueOf());
	};

	return {
		...res,
		combine_cast: getSortCombineCredits("cast") as Array<CombineCast>,
		combine_crew: getSortCombineCredits("crew") as Array<CombineCrew>,
		popular_cast: getPopularCredits("cast"),
		popular_crew: getPopularCredits("crew")
	};
};
