export const getLocation = async (): Promise<{ code: string; name: string; timezone: string }> => {
	const url = 'https://cemin.deno.dev/geo';
	const res = await fetch(url);

	const data = await res.json();

	return {
		code: data.country_code,
		name: data.country_name,
		timezone: data.time_zone
	};
};
